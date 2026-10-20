import { useState, useEffect } from 'react';

const bibleBooks = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew',
  'Mark', 'Luke', 'John', 'Acts', 'Romans',
  '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians',
  'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
  'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter',
  '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

const sampleVerses: Record<string, string> = {
  'John 3:16': 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
  'Psalm 23:1': 'The LORD is my shepherd; I shall not want.',
  'Genesis 1:1': 'In the beginning God created the heaven and the earth.',
  'Proverbs 3:5': 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
  'Romans 8:28': 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
  'Isaiah 40:31': 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
  '1 Corinthians 13:4': 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up.',
  'Psalm 46:1': 'God is our refuge and strength, a very present help in trouble.',
  'Matthew 5:9': 'Blessed are the peacemakers: for they shall be called the children of God.',
  'Ecclesiastes 3:1': 'To every thing there is a season, and a time to every purpose under heaven.',
};

export default function BibleApp() {
  const [search, setSearch] = useState('');
  const [verse, setVerse] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const searchBible = () => {
    const query = search.toLowerCase();
    
    // Search verse references
    for (const [ref, text] of Object.entries(sampleVerses)) {
      if (ref.toLowerCase().includes(query) || text.toLowerCase().includes(query)) {
        setVerse(`${ref}\n\n${text}`);
        setHistory([...history, ref]);
        return;
      }
    }
    
    // Search books
    const bookMatch = bibleBooks.find(b => b.toLowerCase().includes(query));
    if (bookMatch) {
      setVerse(`${bookMatch}\n\n[Book loaded - select chapter and verse to read]`);
      return;
    }
    
    setVerse('No results found. Try "John 3:16" or "Genesis"');
  };

  return (
    <div className="h-full flex flex-col font-mono text-sm">
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchBible()}
            placeholder="Search (e.g. John 3:16)"
            className="flex-1 bg-[#1a1a1a] border border-emerald-900/50 text-white px-3 py-2 focus:outline-none focus:border-[#7bdc75]"
          />
          <button
            onClick={searchBible}
            className="bg-[#7bdc75] text-black px-4 py-2 font-bold hover:bg-[#9cff93]"
          >
            SEARCH
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#1a1a1a] border border-emerald-900/30 p-4 overflow-auto">
        <pre className="whitespace-pre-wrap text-white/80 leading-relaxed">
{verse || 'Welcome to bible_cli\n\nType a verse reference like "John 3:16" or search by keyword.\n\nRecent: ' + history.slice(-3).join(', ') || 'None yet'}
        </pre>
      </div>

      <div className="mt-2 text-xs text-white/30">
        Books: {bibleBooks.slice(0, 5).join(', ')}... | Total: {bibleBooks.length} books
      </div>
    </div>
  );
}