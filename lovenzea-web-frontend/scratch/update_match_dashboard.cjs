const fs = require('fs');

const path = 'src/pages/myshadi/matches/PremiumMatchDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add useLocation to react-router-dom import
if (!content.includes('useLocation')) {
    content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate, useLocation } from 'react-router-dom';");
}

// 2. Add fetchNearMeMatches and fetchRecentVisitors to imports
if (!content.includes('fetchNearMeMatches')) {
    content = content.replace("fetchNewMatches,", "fetchNewMatches, fetchNearMeMatches, fetchRecentVisitors,");
}

// 3. Update useSelector to include nearMeMatches and recentVisitors
content = content.replace(
    "const { newMatches, searchResults, filterOptions, sentRequests, shortlistedProfiles, loading, searchLoading } = useSelector((state) => state.match);",
    "const { newMatches, nearMeMatches, recentVisitors, searchResults, filterOptions, sentRequests, shortlistedProfiles, loading, searchLoading } = useSelector((state) => state.match);"
);

// 4. Get active tab from URL and use it in useEffect
if (!content.includes('const location = useLocation();')) {
    content = content.replace(
        "const navigate = useNavigate();",
        "const navigate = useNavigate();\n    const location = useLocation();\n    const tab = new URLSearchParams(location.search).get('tab') || 'new';"
    );
}

// 5. Update useEffect to fetch based on tab
const oldUseEffect = `    useEffect(() => {
        dispatch(fetchNewMatches({ page: 0, size: 20 }));
        dispatch(fetchSentRequests());
        dispatch(fetchShortlist());
        dispatch(fetchFilterOptions());
        dispatch(searchPremiumProfiles({}));
    }, [dispatch]);`;

const newUseEffect = `    useEffect(() => {
        if (tab === 'nearme' || tab === 'near') {
            dispatch(fetchNearMeMatches({ page: 0, size: 20 }));
        } else if (tab === 'viewedme') {
            dispatch(fetchRecentVisitors({ page: 0, size: 20 }));
        } else {
            dispatch(fetchNewMatches({ page: 0, size: 20 }));
            // Only load default search profiles if we are on 'new' tab
            dispatch(searchPremiumProfiles({}));
        }
        dispatch(fetchSentRequests());
        dispatch(fetchShortlist());
        dispatch(fetchFilterOptions());
    }, [dispatch, tab]);`;

content = content.replace(oldUseEffect, newUseEffect);

// 6. Fix `getFormattedMatches` to not hardcode `newMatches`
// It currently has `return newMatches.map(m => {`
// Let's replace it with `return sourceMatches.map(m => {`
content = content.replace("return newMatches.map(m => {", "return sourceMatches.map(m => {");

// 7. Update displayMatches to use the correct array
const oldDisplayMatches = "const displayMatches = getFormattedMatches(searchResults?.content || newMatches);";
const newDisplayMatches = `    let sourceArray = newMatches;
    if (tab === 'nearme' || tab === 'near') {
        sourceArray = nearMeMatches;
    } else if (tab === 'viewedme') {
        sourceArray = recentVisitors;
    } else if (Object.keys(filters).length > 0 && searchResults?.content) {
        sourceArray = searchResults.content;
    }
    
    const displayMatches = getFormattedMatches(sourceArray);`;

content = content.replace(oldDisplayMatches, newDisplayMatches);

// 8. Update UI headings based on tab
content = content.replace(
    "CURATED MATCHES FOR YOU",
    "{tab === 'nearme' ? 'MATCHES NEAR YOU' : tab === 'viewedme' ? 'PEOPLE WHO VIEWED YOU' : 'CURATED MATCHES FOR YOU'}"
);

content = content.replace(
    "Find Someone Worth Meeting",
    "{tab === 'nearme' ? 'Find Singles In Your Area' : tab === 'viewedme' ? 'Discover Who Is Interested' : 'Find Someone Worth Meeting'}"
);

content = content.replace(
    "Explore compatible profiles based on your preferences & relationship goals.",
    "{tab === 'nearme' ? 'Connect with matches located close to you.' : tab === 'viewedme' ? 'These members recently viewed your profile.' : 'Explore compatible profiles based on your preferences & relationship goals.'}"
);

fs.writeFileSync(path, content);
console.log('Successfully updated PremiumMatchDashboard.jsx');
