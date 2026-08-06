const fs = require('fs');
const path = require('path');

// 1. Fix dummy data in TodayMatchView.jsx
const todayMatchPath = path.join(process.cwd(), 'src', 'pages', 'matches', 'TodayMatchView.jsx');
if (fs.existsSync(todayMatchPath)) {
  let content = fs.readFileSync(todayMatchPath, 'utf8');
  content = content.replace(
    `{(profile.hobbies || "Cooking, Music, Reading, Cycling, Trekking").split(',').map((hobby, idx) => (`,
    `{profile.hobbies ? profile.hobbies.split(',').map((hobby, idx) => (`
  );
  // I need to properly handle the ternary since I just changed the truthy part.
  // Wait, let's just do a string replace of the exact whole line and the fallback
  // In TodayMatchView.jsx line 419:
  // {(profile.hobbies || "Cooking, Music, Reading, Cycling, Trekking").split(',').map((hobby, idx) => (
  // Let's replace it with:
  // {profile.hobbies && profile.hobbies.split(',').map((hobby, idx) => (
  content = content.replace(
    `{(profile.hobbies || "Cooking, Music, Reading, Cycling, Trekking").split(',').map((hobby, idx) => (`,
    `{(profile.hobbies || "").split(',').filter(h => h.trim() !== "").map((hobby, idx) => (`
  );
  fs.writeFileSync(todayMatchPath, content, 'utf8');
  console.log('Fixed TodayMatchView.jsx');
}

// 2. Fix dummy data in MatchProfileDetails.jsx
const matchProfileDetailsPath = path.join(process.cwd(), 'src', 'pages', 'matches', 'MatchProfileDetails.jsx');
if (fs.existsSync(matchProfileDetailsPath)) {
  let content = fs.readFileSync(matchProfileDetailsPath, 'utf8');
  // It has: {['Music', 'Cooking', 'Travel', 'Reading', 'Yoga', 'Movies'].map((hobby) => (
  // We want to use profile.hobbies if it exists, otherwise empty. But profile is already available? Yes.
  // Let's replace:
  content = content.replace(
    `{['Music', 'Cooking', 'Travel', 'Reading', 'Yoga', 'Movies'].map((hobby) => (`,
    `{profile?.hobbies ? profile.hobbies.split(',').filter(h => h.trim() !== '').map((hobby) => (`
  );
  // We need to also handle the closing tag of the map. Wait, we can just replace the array.
  content = content.replace(
    `{['Music', 'Cooking', 'Travel', 'Reading', 'Yoga', 'Movies']`,
    `{(profile?.hobbies ? profile.hobbies.split(',').filter(h => h.trim() !== '') : [])`
  );
  fs.writeFileSync(matchProfileDetailsPath, content, 'utf8');
  console.log('Fixed MatchProfileDetails.jsx');
}

// 3. Fix dummy data in MyProfile.jsx
const myProfilePath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'myProfile', 'MyProfile.jsx');
if (fs.existsSync(myProfilePath)) {
  let content = fs.readFileSync(myProfilePath, 'utf8');
  // Line 1990: {['🎵 Music', '✈️ Traveling', '📚 Reading', '🍳 Cooking', '📸 Photography', '🧘‍♀️ Yoga'].map((tag, i) => (
  // Let's replace the array with profileData.hobbies
  content = content.replace(
    `{['🎵 Music', '✈️ Traveling', '📚 Reading', '🍳 Cooking', '📸 Photography', '🧘‍♀️ Yoga'].map((tag, i) => (`,
    `{profileData.hobbies.map((tag, i) => (`
  );
  fs.writeFileSync(myProfilePath, content, 'utf8');
  console.log('Fixed MyProfile.jsx');
}

// 4. Fix Toast z-index in App.jsx
const appJsxPath = path.join(process.cwd(), 'src', 'App.jsx');
if (fs.existsSync(appJsxPath)) {
  let content = fs.readFileSync(appJsxPath, 'utf8');
  // Line 676: <Toaster position="top-center" />
  content = content.replace(
    `<Toaster position="top-center" />`,
    `<Toaster position="top-center" containerStyle={{ zIndex: 9999999 }} toastOptions={{ style: { marginTop: '80px' } }} />`
  );
  fs.writeFileSync(appJsxPath, content, 'utf8');
  console.log('Fixed Toaster in App.jsx');
}
