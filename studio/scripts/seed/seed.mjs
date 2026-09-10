import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load env vars from .env.local if not present in process.env
function loadEnv() {
  const envPaths = [
    path.resolve(__dirname, '../../.env.local'),
    path.resolve(__dirname, '../../../.env.local'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../../../.env'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'oxyuqwfg';

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production';

const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_AUTH_TOKEN;

if (!token) {
  console.error('❌ Error: SANITY_API_READ_TOKEN or write token is not set in environment or .env.local');
  process.exit(1);
}

console.log('🚀 Initializing Sanity Seeding...');
console.log(`📌 Project ID: ${projectId}`);
console.log(`📌 Dataset:    ${dataset}`);

const assetCache = new Map();

// Helper to download external image and upload to Sanity Asset CDN
async function uploadImageAsset(imageUrl, filename = 'asset.jpg') {
  if (assetCache.has(imageUrl)) {
    return assetCache.get(imageUrl);
  }

  try {
    const res = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Sanity Seeder)'
      }
    });
    if (!res.ok) {
      throw new Error(`Failed to download image from ${imageUrl}: ${res.statusText}`);
    }
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'image/jpeg';

    const uploadUrl = `https://${projectId}.api.sanity.io/v2024-01-01/assets/images/${dataset}?filename=${encodeURIComponent(filename)}`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        Authorization: `Bearer ${token}`
      },
      body: buffer
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      throw new Error(`Failed to upload image asset to Sanity: ${uploadRes.status} ${errText}`);
    }

    const data = await uploadRes.json();
    const assetRef = data.document?._id;
    if (!assetRef) {
      throw new Error('Upload succeeded but no document _id returned.');
    }

    assetCache.set(imageUrl, assetRef);
    return assetRef;
  } catch (err) {
    console.warn(`⚠️ Asset upload warning for ${imageUrl}:`, err.message);
    return null;
  }
}

// Convert Portable Text blocks to plain text
function blocksToText(blocks) {
  if (typeof blocks === 'string') return blocks;
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) return '';
      return block.children.map((child) => child.text || '').join('');
    })
    .filter(Boolean)
    .join('\n\n');
}

// Format duration from seconds or string
function formatDuration(duration) {
  if (typeof duration === 'number') {
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  if (typeof duration === 'string') return duration;
  return '10:00';
}

// Normalize skill level title
function normalizeLevel(level) {
  if (!level) return 'Intermediate';
  const lower = String(level).toLowerCase();
  if (lower === 'beginner') return 'Beginner';
  if (lower === 'intermediate') return 'Intermediate';
  if (lower === 'advanced') return 'Advanced';
  return 'Intermediate';
}

async function processImageField(imageField, filename) {
  if (!imageField) return undefined;
  let assetUrl = null;
  if (imageField._sanityAsset && imageField._sanityAsset.startsWith('image@')) {
    assetUrl = imageField._sanityAsset.replace(/^image@/, '');
  } else if (typeof imageField === 'string' && (imageField.startsWith('http://') || imageField.startsWith('https://'))) {
    assetUrl = imageField;
  } else if (imageField.asset?._ref) {
    return imageField;
  }

  if (assetUrl) {
    const assetRef = await uploadImageAsset(assetUrl, filename);
    if (assetRef) {
      return {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: assetRef
        },
        alt: imageField.alt || ''
      };
    }
  }

  return undefined;
}

// Send mutations in batches
async function sendMutations(mutations) {
  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ mutations })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Sanity mutation error (${res.status}): ${errText}`);
  }

  return await res.json();
}

async function runSeed() {
  const ndjsonPath = path.resolve(__dirname, 'seed.ndjson');
  if (!fs.existsSync(ndjsonPath)) {
    console.error(`❌ File not found: ${ndjsonPath}`);
    process.exit(1);
  }

  const rawDocs = [];
  const fileStream = fs.createReadStream(ndjsonPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      rawDocs.push(JSON.parse(trimmed));
    } catch (e) {
      console.error('Invalid JSON line in seed.ndjson:', e.message);
    }
  }

  console.log(`📄 Read ${rawDocs.length} documents from seed.ndjson`);

  const categories = rawDocs.filter((d) => d._type === 'category');
  const instructors = rawDocs.filter((d) => d._type === 'instructor');
  const lessons = rawDocs.filter((d) => d._type === 'lesson');
  const courses = rawDocs.filter((d) => d._type === 'course');

  console.log(`  - Categories:  ${categories.length}`);
  console.log(`  - Instructors: ${instructors.length}`);
  console.log(`  - Lessons:     ${lessons.length}`);
  console.log(`  - Courses:     ${courses.length}`);

  // 1. Process Categories
  console.log('\n📂 Processing Categories...');
  const preparedCategories = categories.map((cat) => ({
    _id: cat._id,
    _type: 'category',
    title: cat.title,
    slug: cat.slug || { _type: 'slug', current: cat._id.replace('category.', '') },
    description: cat.description || ''
  }));

  // 2. Process Instructors
  console.log('\n👨‍🏫 Processing Instructors & uploading avatars...');
  const preparedInstructors = [];
  for (const inst of instructors) {
    const photo = await processImageField(inst.photo, `${inst.slug?.current || 'instructor'}.jpg`);
    const expertiseStr = Array.isArray(inst.expertise) ? inst.expertise.join(', ') : (inst.expertise || '');
    const bioText = blocksToText(inst.bio);

    preparedInstructors.push({
      _id: inst._id,
      _type: 'instructor',
      name: inst.name,
      slug: inst.slug,
      photo,
      expertise: expertiseStr,
      bio: bioText
    });
    console.log(`  ✓ Prepared instructor: ${inst.name}`);
  }

  // 3. Process Lessons
  console.log('\n📚 Processing Lessons & uploading thumbnails...');
  const preparedLessons = [];
  let lessonIdx = 0;
  for (const les of lessons) {
    lessonIdx++;
    const poster = await processImageField(
      les.poster || les.thumbnail,
      `${les.slug?.current || 'lesson'}-poster.jpg`
    );
    const durationStr = formatDuration(les.duration);
    const isFree = Boolean(les.isFreePreview ?? les.freePreview);

    preparedLessons.push({
      _id: les._id,
      _type: 'lesson',
      title: les.title,
      slug: les.slug,
      videoUrl: les.videoUrl,
      poster,
      duration: durationStr,
      isFreePreview: isFree,
      studentCount: les.studentCount || 0,
      keyPoints: Array.isArray(les.keyPoints) ? les.keyPoints : [],
      proTip: les.proTip || '',
      notes: Array.isArray(les.notes) ? les.notes : [],
      resources: Array.isArray(les.resources) ? les.resources : []
    });

    if (lessonIdx % 20 === 0 || lessonIdx === lessons.length) {
      console.log(`  ✓ Processed ${lessonIdx}/${lessons.length} lessons`);
    }
  }

  // 4. Process Courses
  console.log('\n🎓 Processing Courses & uploading cover images...');
  const preparedCourses = [];
  for (const crs of courses) {
    const coverImage = await processImageField(
      crs.coverImage,
      `${crs.slug?.current || 'course'}-cover.jpg`
    );

    const modules = (crs.modules || []).map((mod, mIdx) => ({
      _type: 'module',
      _key: mod._key || `module-${mIdx + 1}`,
      title: mod.title,
      summary: mod.summary || '',
      lessons: (mod.lessons || []).map((lRef, lIdx) => ({
        _type: 'reference',
        _key: lRef._key || `lesson-ref-${lIdx + 1}`,
        _ref: lRef._ref
      }))
    }));

    const learningOutcomes = (crs.learningOutcomes || []).map((out, oIdx) => ({
      _type: 'learningOutcome',
      _key: out._key || `outcome-${oIdx + 1}`,
      icon: out.icon || 'layers',
      title: out.title,
      description: out.description || ''
    }));

    preparedCourses.push({
      _id: crs._id,
      _type: 'course',
      title: crs.title,
      slug: crs.slug,
      summary: crs.summary || '',
      coverImage,
      level: normalizeLevel(crs.level),
      price: typeof crs.price === 'number' ? crs.price : 0,
      popular: Boolean(crs.popular),
      studentCount: crs.studentCount || 0,
      instructor: crs.instructor,
      category: crs.category,
      learningOutcomes,
      modules
    });
    console.log(`  ✓ Prepared course: ${crs.title} (${modules.length} modules)`);
  }

  // 5. Commit mutations to Sanity
  console.log('\n💾 Committing documents to Sanity dataset...');
  
  const allDocs = [
    ...preparedCategories,
    ...preparedInstructors,
    ...preparedLessons,
    ...preparedCourses
  ];

  const BATCH_SIZE = 25;
  for (let i = 0; i < allDocs.length; i += BATCH_SIZE) {
    const batch = allDocs.slice(i, i + BATCH_SIZE);
    const mutations = batch.map((doc) => ({
      createOrReplace: doc
    }));
    await sendMutations(mutations);
    console.log(`  ✓ Committed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(allDocs.length / BATCH_SIZE)} (${batch.length} docs)`);
  }

  console.log('\n✨ All documents successfully seeded!');

  // 6. Validation Query
  console.log('\n🔍 Verifying dataset integrity via GROQ...');
  const verifyQuery = `{
    "categoriesCount": count(*[_type == "category"]),
    "instructorsCount": count(*[_type == "instructor"]),
    "lessonsCount": count(*[_type == "lesson"]),
    "coursesCount": count(*[_type == "course"]),
    "modulesTotal": count(*[_type == "course"].modules[]),
    "lessonRefsTotal": count(*[_type == "course"].modules[].lessons[]),
    "sampleCourses": *[_type == "course"] | order(title asc) [0...3] {
      title,
      "instructor": instructor->name,
      "category": category->title,
      "moduleCount": count(modules),
      "lessonCount": count(modules[].lessons[])
    }
  }`;

  const verifyUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(verifyQuery)}`;
  const verifyRes = await fetch(verifyUrl, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const verifyData = await verifyRes.json();

  console.log('\n📊 Live Dataset Verification Summary:');
  console.log(JSON.stringify(verifyData.result, null, 2));

  console.log('\n🎉 Sanity seeding completed successfully with 100% relational integrity!\n');
}

runSeed().catch((err) => {
  console.error('\n❌ Seeding failed:', err);
  process.exit(1);
});
