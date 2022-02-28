import { Book } from "./book";


export class BookDataManipulation {

    public static initData(): void {
        
        if ( localStorage.getItem("initBooks") === "true" ) 
            return;

        let arr: any[];
        arr = new Array<Book>();
        arr.push({
            id: 1,
            slug: 'hari-poter-i-dvorana-tajni',
            title: "Hari Poter i Dvorana tajni",
            author: "Dž. K. Rouling",
            description: "Misteriozno pojavljivanje kućnog vilenjaka Dobija, i njegov pokušaj da spreči Harija da se vrati na Hogvorts navode Darslijeve da ga stave u kućni pritvor do daljeg. Spas stiže u vidu letećeg automobila, kojim upravljaju Ron i njegova braća. Posle raspusta provedenog u Jazbini, nesvakidašnjoj kući Vizlijevih, dramatičnim dolaskom na Hogvorts započinje nova školska Godina. ",
            image: "hp.jpg",
            pages: 292,
            price: 1210,
            yearIssued: 1998,
            onPromotion: true
        });

        arr.push({
            id: 2,
            slug: 'salemovo',
            title: "Salemovo",
            author: "Stephen King",
            description: "Salemovo je mali grad u Novoj Engleskoj okovan silama mraka, grad koji postoji samo u piščevoj mašti. Kao i u mnogim drugim takvim gradovima – koji imaju svoju mračnu prošlost – i u njemu među meštanima kolaju tajni tračevi, dešavaju se neobične stvari i živi uobičajeni broj pijanica i čudaka.",
            image: "salemslot.jpg",
            pages: 624,
            price: 1592,
            yearIssued: 2021,
            onPromotion: true
        });

        arr.push({
            id: 3,
            slug: 'what-they-dont-teach-you-at-harvard-business-school',
            title: "What They Don't Teach You At Harvard Business School",
            author: "Mark M. McCormack",
            description: "Mark McCormack, dubbed 'the most powerful man in sport', founded IMG (International Management Group) on a handshake. It was the first and is the most successful sports management company in the world, becoming a multi-million dollar, worldwide corporation whose activities in the business and marketing spheres are so diverse as to defy classification.",
            image: "wtdtahbs.jpg",
            pages: 1520,
            price: 1592,
            yearIssued: 2016,
            onPromotion: true
        });

        arr.push({
            id: 4,
            slug: 'gospodar-prstenova-i-druzina-prstena',
            title: "GOSPODAR PRSTENOVA I Družina Prstena",
            author: "Džon Ronald Rejel Tolkin",
            description: "Jedan Prsten da svima gospodari, jedan za svima seže. Jedan Prsten da sve okupi, i u tami ih sveže! U najpitomijem i najzabitijem okrugu Srednjeg sveta obitavaju Hobiti, bezazleni mali narod koji nikada nikom ništa nije skrivio, nijedan rat nije vodio i koji život provodi u miru i igri. ",
            image: "lotr1.jpg",
            pages: 432,
            price: 1728,
            yearIssued: 2018,
            onPromotion: true
        }); 
        
        arr.push({
            id: 5,
            slug: 'bogati-otac-siromasni-otac',
            title: "Bogati otac siromašni otac",            
            author: "Robert Kiyosaki",
            description: "NE RADITE ZA NOVAC, NEKA NOVAC RADI ZA VAS! Recepti za finansijski uspeh se često tretiraju kao nedokučive tajne za one koji sa novcem ne umeju. Neki očevi to znaju bolje od drugih, ali češće ne posedaju takvo znanje da prenesu na svoje potomke, jer im je i samima bilo uskraćeno.",
            image: "richdad.jpg",
            pages: 312,
            price: 1188,
            yearIssued: 2018,
            onPromotion: false
        });

        arr.push({
            id: 6,
            slug: 'druga-sansa',
            title: "Druga šansa",
            author: "Robert Kiyosaki",
            description: "Nova knjiga Roberta Kiosakija, \"Druga šansa\" je vaš vodič za novi početak! Od autora bestselera \"Bogati otac siromašni otac\" povodom dvadesetogodišnjice kompanije \"Rich Dad\", stigla nam je nova knjiga i nova šansa za vaš život, vaš novac i naš svet. \"Druga šansa\" je vodič koji će vam pružiti konkretne savete za razumevanje izazova...",
            image: "second-chance.jpg",
            pages: 403,
            price: 1072.50,
            yearIssued: 2018,
            onPromotion: false
        });

        arr.push({
            id: 7,
            slug: 'idi-za-sobom',
            title: "Idi za sobom",
            author: "Boris Subašić",
            description: "Ova knjiga je opis dela mojih putničkih doživljaja, upotpunjenih mnogo većim znanjima drugih ljudi, koja sam koristio za tumačenje i navigaciju lutajući po stazama najveće ideje čovečanstva",
            image: "idi-za-sobom.jpg",
            pages: 256,
            price: 1435.50,
            yearIssued: 2021,
            onPromotion: false
        });

        arr.push({
            id: 8,
            slug: 'zaljubljen-u-rim',
            title: "Zaljubljen u Rim",
            author: "Mark Tedesko",
            description: "„Odupirao sam se, ali me je iznova privlačio. Nisam dolazio, ali me je prizivao. Povukao sam se, ali me je proganjao. Čak sam ga i odbacio, ali me nije napustio...“ Zaljubljen u Rim spada u one retke knjige posle kojih biva jasnije zašto se toliko ljudi zaljubilo u Večni grad burne istorije i velikih promena, uprkos svim njegovim nedostacima.",
            image: "zaljubljen-u-rim.jpg",
            pages: 196,
            price: 629.10,
            yearIssued: 2021,
            onPromotion: true
        });

        arr.push({
            id: 9,
            slug: 'tajna',
            title: "Tajna",
            author: "Ronda Bern",
            description: "U rukama držite veliku Tajnu... Prenošena je kroz vekove, visoko cenjena, sakrivana, izgubljena, kradena, i kupovana za velike svote novca. Vekovima stara Tajna koju su razumeli neki od najistaknutijih ljudi istorije: Platon, Galileo, Betoven, Edison, Karnegi, Ajnštajn – uporedo sa drugim pronalazačima, teolozima, naučnicima i velikim misliocima.",
            image: "tajna.jpg",
            pages: 200,
            price: 1782,
            yearIssued: 2021,
            onPromotion: false
        });

        arr.push({
            id: 10,
            slug: 'srecan-novac',
            title: "Srećan novac",
            author: "Ken Honda",
            description: "Najpoznatiji japanski guru za lični razvoj uči vas kako da dosegnete duševni mir kada je u pitanju novac. Često je novac izvor straha, stresa, ljutnje, razlog za prekid veze, a ponekad može da uništi život. Volimo da mislimo kako je novac samo broj ili parče papira, ali on je mnogo više od toga.",
            image: "srecan-novac.jpg",
            pages: 155,
            price: 668,
            yearIssued: 2022,
            onPromotion: true
        });

        localStorage.removeItem('books');
        localStorage.setItem('books', JSON.stringify(arr));                  
        
        // Set indicator that all book data are sucessfully loaded.
        localStorage.setItem("initBooks", "true");        
    }

    public static areTheSame(b1: Book, b2: Book): boolean {
        return b1.id === b2.id;
    }

    public static numberOfAllBooks(): number {
        let booksStr: any = localStorage.getItem('books');
        let books: Book[];
        books = JSON.parse(booksStr);    
        return books.length;
    }

    public static numberOfAllBooksForGivenSearchTerm(searchTerm: string): number {
        let booksStr: any = localStorage.getItem('books');
        let books: Book[];
        books = JSON.parse(booksStr);    
        searchTerm = searchTerm.toLocaleLowerCase();
        let n: number = 0;
        books.forEach((b: Book) => {
            if ( b.author.toLocaleLowerCase().indexOf(searchTerm) > -1 || b.title.toLocaleLowerCase().indexOf(searchTerm) > -1 )
                n++;
        });
        return n;
    }

    public static getAllBooks(offset: number = 0, limit: number = 0): Book[] {
        let booksArr: Book[] = new Array<Book>();
        let books: Book[];
        let b: Book;
        let booksStr: any = localStorage.getItem('books');
        books = JSON.parse(booksStr);        
        let toLimit: boolean = limit > 0;        
        offset = offset < 0 ? 0 : offset;
        
        for( let i = offset; i<books.length; i++ ) {            
            if ( toLimit && limit === 0 ) {
                break;
            }
            
            b = books[i] as Book;
            booksArr.push(b);    

            if ( toLimit ) {
                limit--;
            }
        }
        return booksArr;
    }

    public static getAllBooksForGivenSearchTerm(searchTerm: string, offset: number = 0, limit: number = 0): Book[] {
        let booksArr: Book[] = new Array<Book>();
        let books: Book[];
        let b: Book;
        let booksStr: any = localStorage.getItem('books');
        books = JSON.parse(booksStr);        
        let toLimit: boolean = limit > 0;        
        offset = offset < 0 ? 0 : offset;
        searchTerm = searchTerm.toLocaleLowerCase();
        
        for( let i = offset; i<books.length; i++ ) {            
            if ( toLimit && limit === 0 ) {
                break;
            }            
            
            b = books[i] as Book;
            if ( b.author.toLocaleLowerCase().indexOf(searchTerm) > -1 || b.title.toLocaleLowerCase().indexOf(searchTerm) > -1 ) {
                booksArr.push(b);    
                if ( toLimit ) {
                    limit--;
                }
            }           
        }
        return booksArr;
    }

    public static getBookBySlug(slug: string): Book | null {
        let b: Book|null = null;
        let books: any = localStorage.getItem('books');
        books = JSON.parse(books);
        for( let i = 0; i<books.length; i++ ) {
            if ( books[i].slug === slug ) {
                b = books[i] as Book;
                break;
            }
        }
        return b;
    }

    public static getBookById(id: number): Book|null {
        let b: Book|null = null;
        let books: any = localStorage.getItem('books');
        books = JSON.parse(books);
        for( let i = 0; i<books.length; i++ ) {
            if ( books[i].id === id ) {
                b = books[i] as Book;
                break;
            }
        }
        return b;
    }
}