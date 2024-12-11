const fetchTagsData = async () => {
  try {
    const responseA = await fetch('/filer/get_tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: "keywordA" })
    });
    const dataA = await responseA.json();
    const keywordATags = dataA.map(tag => ({
      id: tag.id || 1,
      name: tag.tag || "TagX",
      count: tag.file_count || 5,
      isLeft: false,
      keywordId: 1
    }));

    const responseB = await fetch('/filer/get_tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: "keywordB" })
    });
    const dataB = await responseB.json();
    const keywordBTags = dataB.map(tag => ({
      id: tag.id || 2,
      name: tag.tag || "TagX",
      count: tag.file_count || 0,
      isLeft: false,
      keywordId: 2
    }));

    return { keywordATags, keywordBTags };
  } catch (error) {
    throw new Error("Failed to fetch tags data");
  }
};

export { fetchTagsData };
