const fetchTags = async (path) => {
    const response = await fetch('/filer/get_tags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path })
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export { fetchTags }; 