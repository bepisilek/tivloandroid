import { Language } from './translations';

export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correct_answer: string;
}

export interface QuizQuestions {
  [key: string]: QuizQuestion[];
}

export const quizQuestions: Record<Language, QuizQuestion[]> = {
  hu: [
    {
      id: 1,
      category: "Történelem",
      question: "Melyik évben koronázták királlyá I. Istvánt?",
      options: ["1000", "896", "1222", "1055"],
      correct_answer: "1000"
    },
    {
      id: 2,
      category: "Földrajz",
      question: "Mi Ausztrália fővárosa?",
      options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
      correct_answer: "Canberra"
    },
    {
      id: 3,
      category: "Tudomány",
      question: "Mi az arany vegyjele?",
      options: ["Ag", "Au", "Fe", "Cu"],
      correct_answer: "Au"
    },
    {
      id: 4,
      category: "Irodalom",
      question: "Ki írta az 'Egri csillagok' című regényt?",
      options: ["Jókai Mór", "Móricz Zsigmond", "Gárdonyi Géza", "Mikszáth Kálmán"],
      correct_answer: "Gárdonyi Géza"
    },
    {
      id: 5,
      category: "Művészet",
      question: "Ki festette a Mona Lisát?",
      options: ["Michelangelo", "Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso"],
      correct_answer: "Leonardo da Vinci"
    },
    {
      id: 6,
      category: "Csillagászat",
      question: "Melyik a Naprendszer legnagyobb bolygója?",
      options: ["Föld", "Mars", "Szaturnusz", "Jupiter"],
      correct_answer: "Jupiter"
    },
    {
      id: 7,
      category: "Sport",
      question: "Hány játékos van egyszerre a pályán egy labdarúgócsapatban?",
      options: ["10", "11", "12", "9"],
      correct_answer: "11"
    },
    {
      id: 8,
      category: "Biológia",
      question: "Hány foga van egy felnőtt embernek (bölcsességfogakkal együtt)?",
      options: ["28", "30", "32", "34"],
      correct_answer: "32"
    },
    {
      id: 9,
      category: "Történelem",
      question: "Mikor tört ki az első világháború?",
      options: ["1914", "1918", "1939", "1945"],
      correct_answer: "1914"
    },
    {
      id: 10,
      category: "Zene",
      question: "Melyik hangszeren játszott Frédéric Chopin?",
      options: ["Hegedű", "Zongora", "Gitár", "Furulya"],
      correct_answer: "Zongora"
    },
    {
      id: 11,
      category: "Fizika",
      question: "Kiről nevezték el az elektromos áram mértékegységét (Amper)?",
      options: ["Alessandro Volta", "André-Marie Ampère", "James Watt", "Michael Faraday"],
      correct_answer: "André-Marie Ampère"
    },
    {
      id: 12,
      category: "Földrajz",
      question: "Melyik a Föld legnagyobb óceánja?",
      options: ["Atlanti-óceán", "Indiai-óceán", "Csendes-óceán", "Jeges-tenger"],
      correct_answer: "Csendes-óceán"
    },
    {
      id: 13,
      category: "Film",
      question: "Melyik film nyerte a legtöbb Oscar-díjat (a Ben-Hurral és a Titanic-kal holtversenyben)?",
      options: ["A Gyűrűk Ura: A király visszatér", "Csillagok háborúja", "Keresztapa", "Avatar"],
      correct_answer: "A Gyűrűk Ura: A király visszatér"
    },
    {
      id: 14,
      category: "Gasztronómia",
      question: "Melyik ország eredeti étele a sushi?",
      options: ["Kína", "Japán", "Thaiföld", "Korea"],
      correct_answer: "Japán"
    },
    {
      id: 15,
      category: "Technológia",
      question: "Mit jelent a 'www' rövidítés az interneten?",
      options: ["World Wide Web", "World Web Wide", "Wide World Web", "Web World Wide"],
      correct_answer: "World Wide Web"
    },
    {
      id: 16,
      category: "Matematika",
      question: "Mennyi a Pi (π) értéke két tizedesjegyig kerekítve?",
      options: ["3,12", "3,14", "3,16", "3,18"],
      correct_answer: "3,14"
    },
    {
      id: 17,
      category: "Irodalom",
      question: "Ki írta a Rómeó és Júliát?",
      options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
      correct_answer: "William Shakespeare"
    },
    {
      id: 18,
      category: "Biológia",
      question: "Melyik állat a leggyorsabb szárazföldi emlős?",
      options: ["Oroszlán", "Gepárd", "Antilop", "Ló"],
      correct_answer: "Gepárd"
    },
    {
      id: 19,
      category: "Kémia",
      question: "Mi a víz kémiai képlete?",
      options: ["CO2", "H2O", "O2", "NaCl"],
      correct_answer: "H2O"
    },
    {
      id: 20,
      category: "Általános",
      question: "Hány napból áll egy szökőév?",
      options: ["364", "365", "366", "367"],
      correct_answer: "366"
    }
  ],
  en: [
    {
      id: 1,
      category: "History",
      question: "In which year was King Stephen I of Hungary crowned?",
      options: ["1000", "896", "1222", "1055"],
      correct_answer: "1000"
    },
    {
      id: 2,
      category: "Geography",
      question: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
      correct_answer: "Canberra"
    },
    {
      id: 3,
      category: "Science",
      question: "What is the chemical symbol for gold?",
      options: ["Ag", "Au", "Fe", "Cu"],
      correct_answer: "Au"
    },
    {
      id: 4,
      category: "Literature",
      question: "Who wrote 'Eclipse of the Crescent Moon' (Egri csillagok)?",
      options: ["Mór Jókai", "Zsigmond Móricz", "Géza Gárdonyi", "Kálmán Mikszáth"],
      correct_answer: "Géza Gárdonyi"
    },
    {
      id: 5,
      category: "Art",
      question: "Who painted the Mona Lisa?",
      options: ["Michelangelo", "Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso"],
      correct_answer: "Leonardo da Vinci"
    },
    {
      id: 6,
      category: "Astronomy",
      question: "Which is the largest planet in our Solar System?",
      options: ["Earth", "Mars", "Saturn", "Jupiter"],
      correct_answer: "Jupiter"
    },
    {
      id: 7,
      category: "Sports",
      question: "How many players are on the field for one football (soccer) team at a time?",
      options: ["10", "11", "12", "9"],
      correct_answer: "11"
    },
    {
      id: 8,
      category: "Biology",
      question: "How many teeth does an adult human have (including wisdom teeth)?",
      options: ["28", "30", "32", "34"],
      correct_answer: "32"
    },
    {
      id: 9,
      category: "History",
      question: "When did World War I begin?",
      options: ["1914", "1918", "1939", "1945"],
      correct_answer: "1914"
    },
    {
      id: 10,
      category: "Music",
      question: "Which instrument did Frédéric Chopin play?",
      options: ["Violin", "Piano", "Guitar", "Flute"],
      correct_answer: "Piano"
    },
    {
      id: 11,
      category: "Physics",
      question: "After whom is the unit of electric current (Ampere) named?",
      options: ["Alessandro Volta", "André-Marie Ampère", "James Watt", "Michael Faraday"],
      correct_answer: "André-Marie Ampère"
    },
    {
      id: 12,
      category: "Geography",
      question: "Which is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
      correct_answer: "Pacific Ocean"
    },
    {
      id: 13,
      category: "Film",
      question: "Which film won the most Academy Awards (tied with Ben-Hur and Titanic)?",
      options: ["The Lord of the Rings: The Return of the King", "Star Wars", "The Godfather", "Avatar"],
      correct_answer: "The Lord of the Rings: The Return of the King"
    },
    {
      id: 14,
      category: "Gastronomy",
      question: "From which country does sushi originate?",
      options: ["China", "Japan", "Thailand", "Korea"],
      correct_answer: "Japan"
    },
    {
      id: 15,
      category: "Technology",
      question: "What does 'www' stand for on the internet?",
      options: ["World Wide Web", "World Web Wide", "Wide World Web", "Web World Wide"],
      correct_answer: "World Wide Web"
    },
    {
      id: 16,
      category: "Mathematics",
      question: "What is the value of Pi (π) rounded to two decimal places?",
      options: ["3.12", "3.14", "3.16", "3.18"],
      correct_answer: "3.14"
    },
    {
      id: 17,
      category: "Literature",
      question: "Who wrote Romeo and Juliet?",
      options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
      correct_answer: "William Shakespeare"
    },
    {
      id: 18,
      category: "Biology",
      question: "Which animal is the fastest land mammal?",
      options: ["Lion", "Cheetah", "Antelope", "Horse"],
      correct_answer: "Cheetah"
    },
    {
      id: 19,
      category: "Chemistry",
      question: "What is the chemical formula for water?",
      options: ["CO2", "H2O", "O2", "NaCl"],
      correct_answer: "H2O"
    },
    {
      id: 20,
      category: "General",
      question: "How many days are there in a leap year?",
      options: ["364", "365", "366", "367"],
      correct_answer: "366"
    }
  ],
  de: [
    {
      id: 1,
      category: "Geschichte",
      question: "In welchem Jahr wurde König Stephan I. von Ungarn gekrönt?",
      options: ["1000", "896", "1222", "1055"],
      correct_answer: "1000"
    },
    {
      id: 2,
      category: "Geographie",
      question: "Was ist die Hauptstadt von Australien?",
      options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
      correct_answer: "Canberra"
    },
    {
      id: 3,
      category: "Wissenschaft",
      question: "Was ist das chemische Symbol für Gold?",
      options: ["Ag", "Au", "Fe", "Cu"],
      correct_answer: "Au"
    },
    {
      id: 4,
      category: "Literatur",
      question: "Wer schrieb 'Sterne von Eger' (Egri csillagok)?",
      options: ["Mór Jókai", "Zsigmond Móricz", "Géza Gárdonyi", "Kálmán Mikszáth"],
      correct_answer: "Géza Gárdonyi"
    },
    {
      id: 5,
      category: "Kunst",
      question: "Wer malte die Mona Lisa?",
      options: ["Michelangelo", "Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso"],
      correct_answer: "Leonardo da Vinci"
    },
    {
      id: 6,
      category: "Astronomie",
      question: "Welcher ist der größte Planet in unserem Sonnensystem?",
      options: ["Erde", "Mars", "Saturn", "Jupiter"],
      correct_answer: "Jupiter"
    },
    {
      id: 7,
      category: "Sport",
      question: "Wie viele Spieler sind gleichzeitig auf dem Feld für eine Fußballmannschaft?",
      options: ["10", "11", "12", "9"],
      correct_answer: "11"
    },
    {
      id: 8,
      category: "Biologie",
      question: "Wie viele Zähne hat ein erwachsener Mensch (einschließlich Weisheitszähne)?",
      options: ["28", "30", "32", "34"],
      correct_answer: "32"
    },
    {
      id: 9,
      category: "Geschichte",
      question: "Wann begann der Erste Weltkrieg?",
      options: ["1914", "1918", "1939", "1945"],
      correct_answer: "1914"
    },
    {
      id: 10,
      category: "Musik",
      question: "Welches Instrument spielte Frédéric Chopin?",
      options: ["Geige", "Klavier", "Gitarre", "Flöte"],
      correct_answer: "Klavier"
    },
    {
      id: 11,
      category: "Physik",
      question: "Nach wem ist die Einheit des elektrischen Stroms (Ampere) benannt?",
      options: ["Alessandro Volta", "André-Marie Ampère", "James Watt", "Michael Faraday"],
      correct_answer: "André-Marie Ampère"
    },
    {
      id: 12,
      category: "Geographie",
      question: "Welcher ist der größte Ozean der Erde?",
      options: ["Atlantischer Ozean", "Indischer Ozean", "Pazifischer Ozean", "Arktischer Ozean"],
      correct_answer: "Pazifischer Ozean"
    },
    {
      id: 13,
      category: "Film",
      question: "Welcher Film gewann die meisten Oscars (gleichauf mit Ben-Hur und Titanic)?",
      options: ["Der Herr der Ringe: Die Rückkehr des Königs", "Star Wars", "Der Pate", "Avatar"],
      correct_answer: "Der Herr der Ringe: Die Rückkehr des Königs"
    },
    {
      id: 14,
      category: "Gastronomie",
      question: "Aus welchem Land stammt Sushi ursprünglich?",
      options: ["China", "Japan", "Thailand", "Korea"],
      correct_answer: "Japan"
    },
    {
      id: 15,
      category: "Technologie",
      question: "Wofür steht 'www' im Internet?",
      options: ["World Wide Web", "World Web Wide", "Wide World Web", "Web World Wide"],
      correct_answer: "World Wide Web"
    },
    {
      id: 16,
      category: "Mathematik",
      question: "Wie lautet der Wert von Pi (π) auf zwei Dezimalstellen gerundet?",
      options: ["3,12", "3,14", "3,16", "3,18"],
      correct_answer: "3,14"
    },
    {
      id: 17,
      category: "Literatur",
      question: "Wer schrieb Romeo und Julia?",
      options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
      correct_answer: "William Shakespeare"
    },
    {
      id: 18,
      category: "Biologie",
      question: "Welches Tier ist das schnellste Landsäugetier?",
      options: ["Löwe", "Gepard", "Antilope", "Pferd"],
      correct_answer: "Gepard"
    },
    {
      id: 19,
      category: "Chemie",
      question: "Was ist die chemische Formel für Wasser?",
      options: ["CO2", "H2O", "O2", "NaCl"],
      correct_answer: "H2O"
    },
    {
      id: 20,
      category: "Allgemein",
      question: "Wie viele Tage hat ein Schaltjahr?",
      options: ["364", "365", "366", "367"],
      correct_answer: "366"
    }
  ]
};

// Helper function to get today's question based on date
export const getDailyQuestion = (language: Language): QuizQuestion => {
  const questions = quizQuestions[language];
  const today = new Date();
  // Use day of year to cycle through questions
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const questionIndex = dayOfYear % questions.length;
  return questions[questionIndex];
};

// Get the date string for today (used for localStorage key)
export const getTodayDateString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};
