const fs = require('fs');

const path = 'src/pages/myshadi/matches/PremiumMatchDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add the applyLocalFilters function before the sourceArray logic
const localFiltersLogic = `
    const applyLocalFilters = (profiles, currentFilters) => {
        if (!profiles || !currentFilters || Object.keys(currentFilters).length === 0) return profiles;
        
        return profiles.filter(p => {
            if (currentFilters.keyword && !p.fullName?.toLowerCase().includes(currentFilters.keyword.toLowerCase()) && !p.aboutMe?.toLowerCase().includes(currentFilters.keyword.toLowerCase())) return false;
            
            if (currentFilters.religion && p.religion !== currentFilters.religion) return false;
            if (currentFilters.caste && p.caste !== currentFilters.caste) return false;
            if (currentFilters.maritalStatus && p.maritalStatus !== currentFilters.maritalStatus) return false;
            if (currentFilters.motherTongue && p.motherTongue !== currentFilters.motherTongue) return false;
            if (currentFilters.country && p.country !== currentFilters.country) return false;
            if (currentFilters.state && p.state !== currentFilters.state) return false;
            if (currentFilters.city && p.city !== currentFilters.city) return false;
            if (currentFilters.educationLevel && p.educationLevel !== currentFilters.educationLevel) return false;
            if (currentFilters.occupation && p.occupation !== currentFilters.occupation) return false;
            if (currentFilters.diet && p.diet !== currentFilters.diet) return false;
            if (currentFilters.smokingHabit && p.smokingHabit !== currentFilters.smokingHabit) return false;
            if (currentFilters.drinkingHabit && p.drinkingHabit !== currentFilters.drinkingHabit) return false;
            if (currentFilters.manglikStatus && p.manglikStatus !== currentFilters.manglikStatus) return false;
            
            if (currentFilters.onlineNow && !p.isOnline) return false;
            
            return true;
        });
    };

    let sourceArray = newMatches;
    if (tab === 'nearme' || tab === 'near') {
        sourceArray = applyLocalFilters(nearMeMatches, filters);
    } else if (tab === 'viewedme') {
        sourceArray = applyLocalFilters(recentVisitors, filters);
    } else {
        if (Object.keys(filters).length > 0 && searchResults?.content) {
            sourceArray = searchResults.content;
        } else {
            sourceArray = newMatches;
        }
    }
`;

// Replace the old sourceArray logic
const oldSourceArrayLogic = `    let sourceArray = newMatches;
    if (tab === 'nearme' || tab === 'near') {
        sourceArray = nearMeMatches;
    } else if (tab === 'viewedme') {
        sourceArray = recentVisitors;
    } else if (Object.keys(filters).length > 0 && searchResults?.content) {
        sourceArray = searchResults.content;
    }`;

content = content.replace(oldSourceArrayLogic, localFiltersLogic.trim());

fs.writeFileSync(path, content);
console.log('Successfully added local filtering logic');
