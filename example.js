// Pomocnicza funkcja do sprawdzania czy tekst to URL
const isUrl = (string) => {
    try { return new URL(string); } catch (_) { return false; }
};

document.getElementById('qa-save').onclick = async () => {
    let content = document.getElementById('qa-content').value.trim();
    const tags = document.getElementById('qa-tags').value.split(',').map(t => t.trim());
    if (!content) return;

    const user = auth.currentUser;
    if (!user) return alert("Błąd autoryzacji");

    let finalType = qaType;
    let linkMeta = {};

    // --- INTELIGENTNA DETEKCJA ---
    const urlData = isUrl(content);
    if (urlData) {
        finalType = 'link';
        // Używamy serwisu Google do pobrania favicony
        const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${urlData.hostname}`;

        linkMeta = {
            title: urlData.hostname.replace('www.', ''), // Uproszczony tytuł z domeny
            favicon: faviconUrl,
            fullUrl: content
        };
    } else if (content.includes('```') || content.length > 100 && (content.includes('{') || content.includes('function'))) {
        finalType = 'code';
    } else {
        finalType = 'text';
    }

    await addDoc(collection(db, 'raindrop_items'), {
        content,
        type: finalType,
        priority: qaPrio,
        tags,
        linkData: linkMeta, // Nowe pole z ikoną i tytułem
        collectionId: activeCollection === 'all' || activeCollection === 'favs' ? 'global' : activeCollection,
        isFav: false,
        createdAt: serverTimestamp(),
        userId: user.uid
    });

    document.getElementById('qa-content').value = '';
    document.getElementById('quick-add-window').classList.add('hidden');
};