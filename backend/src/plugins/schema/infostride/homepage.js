const Post = require("../../../models/Post");

// Sample employee data function simulating the retrieval of data
function getEmployeeData() {
    return {
        our_team: [
            { name: 'John Doe', position: 'Developer', avatar: { url: 'https://example.com/john.jpg' } },
            { name: 'Jane Smith', position: 'CEO', avatar: { url: 'https://example.com/jane.jpg' } }
        ],
        seo: [],
        design: [],
        development: [],
        hr: [],
        finance: [],
        business_development: []
    };
}

async function generateJsonLd(postId) {
    // Sample post data retrieval based on post ID
    // Replace this with actual logic to get post data from your data source
    const postData = await Post.findById(postId);

    const data = getEmployeeData();
    const allEmployees = [].concat(
        data.our_team,
        data.seo,
        data.design,
        data.development,
        data.hr,
        data.finance,
        data.business_development
    );

    const employeeEntities = allEmployees.map(employee => {
        const entity = {
            "@type": "Person",
            "name": employee.name,
            "jobTitle": employee.position,
            "image": employee.avatar.url
        };
        if (employee.position === 'CEO') {
            entity["sameAs"] = "https://thelogician.com/";
        }
        return entity;
    });

    return {
        "@context": "https://schema.org",
        "@type": "DEMO SEO DATA FROM FILE",
        "name": postData?.seoData.seoTitle, // post title
        "description": postData?.seoData.seoTitle, // post description
        "url": postData?.seoData.seoTitle, // post url
        "isPartOf": {
            "@type": "WebSite",
            "name": "Infostride",
            "url": "https://contentlocker.com/"
        },
        "about": {
            "@type": "Organization",
            "name": "Infostride",
            "numberOfEmployees": employeeEntities.length,
            "employee": employeeEntities
        },
        "potentialAction": {
            "@type": "Action",
            "name": "Apply Now",
            "target": "https://contentlocker.com/contact/"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": "https://contentlocker.com/",
                        "name": "Infostride"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": postData.url,
                        "name": postData.title
                    }
                }
            ]
        }
    };
}

module.exports = { generateJsonLd };