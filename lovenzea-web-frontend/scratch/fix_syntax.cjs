const fs = require('fs');
const path = require('path');

// Fix TodayMatchView.jsx
const todayMatchPath = path.join(process.cwd(), 'src', 'pages', 'matches', 'TodayMatchView.jsx');
if (fs.existsSync(todayMatchPath)) {
  let content = fs.readFileSync(todayMatchPath, 'utf8');
  content = content.replace(
    `{profile.hobbies ? profile.hobbies.split(',').map((hobby, idx) => (`,
    `{(profile.hobbies || "").split(',').filter(h => h.trim() !== "").map((hobby, idx) => (`
  );
  fs.writeFileSync(todayMatchPath, content, 'utf8');
  console.log('Fixed TodayMatchView.jsx');
}

// Fix MatchProfileDetails.jsx
const matchProfileDetailsPath = path.join(process.cwd(), 'src', 'pages', 'matches', 'MatchProfileDetails.jsx');
if (fs.existsSync(matchProfileDetailsPath)) {
  let content = fs.readFileSync(matchProfileDetailsPath, 'utf8');
  content = content.replace(
    `{profile?.hobbies ? profile.hobbies.split(',').filter(h => h.trim() !== '').map((hobby) => (`,
    `{(profile?.hobbies ? profile.hobbies.split(',').filter(h => h.trim() !== '') : []).map((hobby) => (`
  );
  fs.writeFileSync(matchProfileDetailsPath, content, 'utf8');
  console.log('Fixed MatchProfileDetails.jsx');
}
