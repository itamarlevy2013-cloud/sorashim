import { BookOpen, Award, MapPin, ScrollText, Users, Newspaper, ArrowUp } from "lucide-react"
import { FrostedFolderLookbook, type FolderSheet } from "@/components/ui/frosted-folder-lookbook"
import { CountUp } from "@/components/shorashim/count-up"
import { PosterPress } from "@/components/shorashim/poster-press"

/* The family archive inside the folder: four documents from Moshe's life. */
const ARCHIVE: FolderSheet[] = [
  { image: "/images/moshe-portrait.jpg", alt: "דיוקן של משה לוי נחום בצעירותו, בחליפה כהה עם פרח בדש", code: "מסמך 01", title: "משה בצעירותו", detail: "דיוקן משפחתי" },
  { image: "/images/moshe-later-years.jpg", alt: "משה לוי נחום בגיל מבוגר, עם משקפיים וזקן לבן", code: "מסמך 02", title: "בשנותיו המאוחרות", detail: "\u20661890–1985\u2069" },
  { image: "/images/book-cover.jpg", alt: "עטיפת הספר ״כרם היה לידידי״ מאת שלמה טבעוני", code: "מסמך 03", title: "כרם היה לידידי", detail: "הספר על חייו" },
  { image: "/images/street-sign-ceremony.jpg", alt: "טקס חשיפת השלט של רחוב מל״ן, עם קהל של תושבים בסמטה", code: "מסמך 04", title: "רחוב מל״ן", detail: "טקס החשיפה, 2003" },
]

const NAV = [
  ["why", "למה בחרתי"],
  ["timeline", "החיים שלו"],
  ["name", "השם"],
  ["printed", "הדפוס"],
  ["clients", "לקוחות"],
  ["honors", "הוקרה"],
  ["press", "הדפס כרוז"],
  ["reflection", "סיכום"],
] as const

const TIMELINE: [string, string][] = [
  ["14 בדצמבר 1890", "נולד. סיפור חייו מתחיל בתימן: יתום שעלה לארץ לבד."],
  ["שנות ה-20", "נבחר לעמוד בראש העדה התימנית ביפו ובתל אביב."],
  ["1936", "נפתח דפוס מל״ן ברחוב הלל הזקן 6 בתל אביב."],
  ["18 ביולי 1985", "נפטר בגיל 94."],
  ["2003", "הבניין נהרס והדפוס נסגר. באותה שנה עיריית תל אביב-יפו קראה על שמו רחוב."],
]

const REASONS: [string, string][] = [
  ["היעדר ייצוג בתקשורת", "משה הרגיש שלבני עדות המזרח בכלל, ולעדה התימנית בפרט, אין איפה להשמיע את קולם בתקשורת של אותם ימים. הוא רצה ליצור מקום שיענה על הצרכים המיוחדים של הקהילה."],
  ["צמצום פערים ומלחמה בקיפוח", "הוא ראה בדפוס כלי לצמצום הפערים החברתיים ולמניעת תחושת הקיפוח שחוו רבים מבני עדתו."],
  ["השכלה וגאווה עדתית", "הוא האמין שהדפסת עיתון (כמו ״המזרח״), כרוזים וספרים תעזור לבני העדה להתפתח, לצאת מהסגירות העדתית ולהשתלב טוב יותר בחברה."],
]

const PRINTED: [string, string][] = [
  ["עיתון ״המזרח״", "עיתון שמשה ייסד בעצמו. הוא שיקף את חיי בני העדה התימנית בארץ ושימש להם במה."],
  ["כרוזים (פשקווילים)", "מודעות רחוב עם הודעות, קריאות למאבק ומידע לציבור, בעיקר עבור המחתרות והקהילה."],
  ["ספרים", "ספרי הגות, ספרות ואנשי רוח יצאו מתחת מכבשי הדפוס."],
  ["חומרים של המחתרות והממשל", "כרוזי הסברה של האצ״ל, הלח״י וההגנה, וגם מסמכים רשמיים של הממשל הבריטי ואחר כך של ממשלת ישראל."],
  ["צרכים קהילתיים", "כל מה שהיה דרוש לתושבי כרם התימנים, מהזמנות ועד מודעות שכונתיות."],
]

const CLIENTS: [string, string][] = [
  ["אנשי המחתרות", "נציגי האצ״ל והלח״י הגיעו להדפיס חומרי הסברה וכרוזים נגד המנדט הבריטי."],
  ["ארגון ההגנה", "יריב פוליטי של המחתרות באותה תקופה, ובכל זאת השתמש בשירותיו."],
  ["הממשל הבריטי", "באופן מפתיע, גם נציגי השלטון בתקופת המנדט הדפיסו אצלו."],
  ["ממשלת ישראל", "אחרי קום המדינה משרדי ממשלה שונים המשיכו לעבוד עם הדפוס."],
  ["אנשי רוח ותרבות", "סופרים ומשוררים שהיו זקוקים להדפסת הספרים והכתבים שלהם."],
  ["תושבי כרם התימנים", "בני העדה שהדפיסו שם את ״המזרח״ וצרכים קהילתיים."],
]

const HONORS: [string, string][] = [
  ["יקיר העיר תל אביב-יפו", "ההוקרה העירונית הגבוהה ביותר, לאזרחים שתרמו לעיר תרומה יוצאת דופן."],
  ["רחוב על שמו", "ב-2003 הפך ״רחוב הפדויים״ בכרם התימנים ל״רחוב מל״ן״."],
  ["מוכתר כרם התימנים", "הוא נבחר להיות המוכתר הראשון של השכונה, תפקיד הנהגה רשמי ומכובד באותה תקופה."],
  ["יושב ראש העדה התימנית", "הוא נבחר להנהיג את העדה ביפו ובתל אביב בשנות ה-20."],
]

const REFLECTION: [string, string][] = [
  ["תהליך העבודה", "חקרתי את תולדות חייו של משה לוי נחום (מל״ן). אספתי חומרים מהמשפחה וארגנתי אותם לסיפור שמתחיל בתימן ומסתיים בבית דפוס בתל אביב."],
  ["חוויות וקשיים", "היה מאתגר לזקק את כל המידע, אבל התרגשתי לגלות דמות של מנהיג שבנה את עצמו מאפס."],
  ["הסיפור שהרשים אותי", "הכינוי ״מוסא אל-פול״: משה שמכר פול מתחת לחלון הישיבה כדי ללמוד תורה בחינם. זה שיעור טוב בחריצות."],
  ["מה גיליתי על המשפחה שלי?", "גיליתי שהשורשים שלי נטועים בהקמת תל אביב ובהנהגת העדה התימנית, ושבית הדפוס המשפחתי שירת את המחתרות ואת המדינה שבדרך."],
]

function Section({ id, kicker, title, children, className = "" }: { id: string; kicker?: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={"mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28 " + className}>
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h2 className="mt-2 font-head text-3xl md:text-4xl">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Cards({ items, cols = "md:grid-cols-3" }: { items: [string, string][]; cols?: string }) {
  return (
    <ul className={"grid gap-5 sm:grid-cols-2 " + cols}>
      {items.map(([t, d]) => (
        <li key={t} className="glass rounded-lg p-6">
          <h3 className="flex items-center gap-3 font-head text-xl">
            <span className="glow-dot" aria-hidden />
            {t}
          </h3>
          <p className="mt-3 leading-relaxed text-foreground/80">{d}</p>
        </li>
      ))}
    </ul>
  )
}

function Photo({ src, alt, caption, tilt = "-rotate-2" }: { src: string; alt: string; caption: string; tilt?: string }) {
  return (
    <figure className={"sheet mx-auto w-full max-w-sm rounded-[2px] p-3 pb-4 " + tilt}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="aspect-[4/5] w-full object-cover" />
      <figcaption className="mt-3 text-sm text-ink/70">{caption}</figcaption>
    </figure>
  )
}

export default function Home() {
  return (
    <>
      <a href="#why" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-50 focus:rounded focus:bg-tint focus:px-3 focus:py-2 focus:text-ink">
        דלג לתוכן
      </a>

      {/* ===== Navigation ===== */}
      <nav aria-label="ניווט בדף" className="glass fixed inset-x-0 top-0 z-40 !shadow-[inset_0_-1px_0_var(--glass-line)]">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 md:px-8">
          <a href="#top" className="font-head text-xl text-tint" aria-label="לראש הדף">מל״ן</a>
          <ul className="flex gap-5 overflow-x-auto whitespace-nowrap text-sm text-foreground/70 [scrollbar-width:none]">
            {NAV.map(([id, label]) => (
              <li key={id}>
                <a href={"#" + id} className="transition hover:text-foreground">{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ===== Hero: the family archive folder ===== */}
      <header id="top" className="relative">
        <FrostedFolderLookbook
          title="מל״ן"
          subtitle="משה לוי נחום"
          line={"כרם התימנים · \u20661890–1985\u2069"}
          footer="עבודת שורשים"
          wordmark="1936"
          sheets={[...ARCHIVE].reverse()}
          openLabel="פתחו את התיק"
          closeLabel="סגרו את התיק"
          height="100svh"
        />
        <div className="pointer-events-none absolute inset-x-0 top-20 px-4 text-center text-[10px] md:text-xs">
          <p className="kicker !text-[length:inherit]">עבודת שורשים · איתמר לוי, כיתה ח1, תיכון מגידו</p>
        </div>
      </header>

      <main>
        {/* ===== Why I chose this topic ===== */}
        <Section id="why" kicker="פתיחה" title="למה בחרתי בנושא הזה?">
          <div className="grid items-center gap-12 md:grid-cols-[1.3fr_1fr]">
            <div className="space-y-4 text-lg leading-relaxed text-foreground/85">
              <p>בחרתי לחקור את ״דפוס מל״ן״ ואת הסיפור של משה לוי נחום, סבא של סבא שלי (סבא רבא של אבא שלי), שהקים את העסק.</p>
              <p>הדפוס כבר לא פעיל היום, אבל רציתי להבין איך הוא בנה הכול מאפס, מה היה מיוחד בדפוס שלו ואיך הצליח להחזיק מעמד כל כך הרבה שנים. בשבילי זו הזדמנות ללמוד את הסיפור המשפחתי ואת המורשת שהוא השאיר אחריו.</p>
              <p className="text-sm text-muted">מורה: טל עופר</p>
            </div>
            <Photo src="/images/moshe-later-years.jpg" alt="משה לוי נחום בגיל מבוגר, עם משקפיים וזקן לבן" caption="משה בשנותיו המאוחרות" tilt="rotate-2" />
          </div>
        </Section>

        {/* ===== By the numbers ===== */}
        <section aria-label="במספרים" className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="glass grid gap-8 rounded-xl p-8 md:grid-cols-3 md:p-12">
            {[
              [94, "שנים חי משה, מ-1890 עד 1985"],
              [67, "שנים פעל בית הדפוס"],
              [4, "גופים שהיו יריבים, וכולם הדפיסו אצל משה: האצ״ל, הלח״י, ההגנה והממשל הבריטי"],
            ].map(([n, t]) => (
              <div key={t as string}>
                <CountUp to={n as number} className="block font-head text-6xl text-tint [text-shadow:0_0_30px_color-mix(in_srgb,var(--tint)_40%,transparent)]" />
                <p className="mt-2 leading-relaxed text-foreground/80">{t}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Timeline ===== */}
        <Section id="timeline" kicker="ציר זמן" title="החיים שלו במבט אחד">
          <ol className="relative space-y-8 border-r border-glass-line pr-8">
            {TIMELINE.map(([y, t]) => (
              <li key={y} className="relative">
                <span className="glow-dot absolute top-2 -right-[35px] size-2.5" aria-hidden />
                <p className="font-head text-xl text-tint">{y}</p>
                <p className="mt-1 text-lg text-foreground/85">{t}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* ===== The name ===== */}
        <Section id="name" kicker="ראשי תיבות" title="מה המקור של השם ״מל״ן״?">
          <p className="text-lg text-foreground/85">״מל״ן״ הם ראשי התיבות של שמו המלא:</p>
          <div className="mt-8 grid grid-cols-3 gap-4 md:gap-8" aria-label="מ ל נ">
            {[["מ", "משה"], ["ל", "לוי"], ["נ", "נחום"]].map(([l, w], i) => (
              <div key={l} className={"sheet rounded-[2px] p-6 text-center " + ["-rotate-2", "rotate-1", "-rotate-1"][i]}>
                <b className="block font-head text-6xl md:text-8xl">{l}</b>
                <span className="mt-2 block text-lg text-ink/70">{w}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== Nickname ===== */}
        <Section id="nick" kicker="כינוי" title="״מוסא אל-פול״">
          <div className="grid items-center gap-12 md:grid-cols-[1fr_1.3fr]">
            <Photo src="/images/book-cover.jpg" alt="עטיפת הספר ״כרם היה לידידי״ מאת שלמה טבעוני" caption="״כרם היה לידידי״ מאת שלמה טבעוני, הספר על חייו" />
            <div>
              <blockquote className="glass rounded-lg p-6 font-head text-2xl leading-snug md:text-3xl">
                הוא עמד מתחת לחלון הישיבה, מכר פול חם, <span className="text-tint">והקשיב לשיעורים.</span>
              </blockquote>
              <p className="mt-6 text-lg leading-relaxed text-foreground/85">
                בצעירותו משה התפרנס ממכירת פול חם לתלמידי ישיבת הרב קוק בתל אביב. לא היה לו כסף ללימודים, אז הוא עמד עם העגלה מתחת לחלון, הקשיב לשיעורים תוך כדי עבודה, וכך רכש את השכלתו.
              </p>
            </div>
          </div>
        </Section>

        {/* ===== Why he founded the press ===== */}
        <Section id="founding" kicker="ההתחלה" title="מה גרם למשה להקים בית דפוס?">
          <Cards items={REASONS} />
        </Section>

        {/* ===== Photo band ===== */}
        <figure className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/old-tel-aviv.jpg" alt="צילום ישן של רחוב בתל אביב הקטנה, עם אנשים בכובעים ובניינים נמוכים" className="h-[50vh] w-full object-cover opacity-70 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" aria-hidden />
          <figcaption className="absolute inset-x-0 bottom-6 text-center text-sm text-muted">תל אביב של הימים ההם. צילום מהתקופה</figcaption>
        </figure>

        {/* ===== What was printed ===== */}
        <Section id="printed" kicker={undefined} title="מה הדפיסו בבית הדפוס?">
          <div className="mb-6 flex items-center gap-2 text-muted"><Newspaper className="size-5" aria-hidden /> מתחת למכבש</div>
          <Cards items={PRINTED} />
        </Section>

        {/* ===== Clients ===== */}
        <Section id="clients" title="מי היו הלקוחות המיוחדים?">
          <div className="mb-6 flex items-center gap-2 text-muted"><Users className="size-5" aria-hidden /> כולם הגיעו להלל הזקן 6</div>
          <Cards items={CLIENTS} />
        </Section>

        {/* ===== Interactive poster printer ===== */}
        <section id="press" className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <PosterPress />
        </section>

        {/* ===== Location and closing ===== */}
        <Section id="place" title="איפה היה הדפוס, ולמה נסגר?">
          <div className="grid items-center gap-12 md:grid-cols-[1.3fr_1fr]">
            <div className="space-y-4 text-lg leading-relaxed text-foreground/85">
              <p className="flex items-center gap-2"><MapPin className="size-5 text-tint" aria-hidden /><b>המיקום:</b> רחוב הלל הזקן 6, תל אביב.</p>
              <p>בית הדפוס נסגר בשנת 2003, אחרי 67 שנות פעילות, כשהבניין שבו שכן נהרס.</p>
              <p>באותה שנה החליטה עיריית תל אביב-יפו להנציח את משה ושינתה את שמו של רחוב ״הפדויים״ הסמוך לרחוב ״מל״ן״.</p>
            </div>
            <figure className="sheet rotate-1 rounded-[2px] p-3 pb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/street-sign-ceremony.jpg" alt="טקס חשיפת השלט של רחוב מל״ן, עם קהל של תושבים בסמטה" className="aspect-[16/10] w-full object-cover" />
              <figcaption className="mt-3 text-sm text-ink/70">טקס חשיפת רחוב מל״ן, בכרם התימנים</figcaption>
            </figure>
          </div>
        </Section>

        {/* ===== After his death ===== */}
        <Section id="after" title="מי המשיך להפעיל את הדפוס אחרי מותו?">
          <p className="glass max-w-3xl rounded-lg p-6 text-lg leading-relaxed text-foreground/85">
            הילדים של משה. כולם עבדו בבית הדפוס בתפקידים שונים, כמו סדרים ודפסים. אחרי שמשה הלך לעולמו העסק עבר לידיהם, והם המשיכו להפעיל אותו עד הסגירה והריסת הבניין בשנת 2003. בסך הכול הדפוס פעל כ-67 שנה כעסק משפחתי.
          </p>
        </Section>

        {/* ===== Honors ===== */}
        <Section id="honors" kicker="הוקרה" title="באילו פרסים והוקרה זכה משה?">
          <Cards items={HONORS} cols="md:grid-cols-2" />
          <div className="sheet mt-8 flex gap-4 rounded-[2px] p-6">
            <BookOpen className="mt-1 size-6 shrink-0 text-ink/60" aria-hidden />
            <p className="leading-relaxed">
              <b>הספר על חייו: ״כרם היה לידידי״.</b> הספר מגולל את סיפור חייו המדהים, מהיתמות והעלייה לבד מתימן, דרך הקמת דפוס מל״ן ועד למעמדו כמנהיג ציבורי. הוא מקור היסטורי חשוב לתיעוד חיי העדה התימנית בתל אביב הקטנה.
            </p>
          </div>
        </Section>

        {/* ===== Summary and reflection ===== */}
        <Section id="reflection" kicker="סיכום" title="סיכום ורפלקציה">
          <Cards items={REFLECTION} cols="md:grid-cols-2" />
        </Section>
      </main>

      {/* ===== Footer / sources ===== */}
      <footer className="glass mt-10 !shadow-[inset_0_1px_0_var(--glass-line)]">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-8">
          <h3 className="flex items-center gap-2 font-head text-2xl"><ScrollText className="size-6 text-tint" aria-hidden /> מקורות</h3>
          <ul className="mt-4 space-y-1 text-foreground/80">
            <li>אתרים: בינה מלאכותית, ויקיפדיה</li>
            <li>אנשים: רועי לוי (אבא שלי)</li>
            <li>שאלונים</li>
          </ul>
          <p className="mt-6 flex items-center gap-2 text-foreground/85"><Award className="size-5 text-tint" aria-hidden /><b>תודה</b> למשפחה שלי על שימור המורשת, ולמורה טל עופר על ההנחיה.</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
            <p>איתמר לוי, כיתה ח1, תיכון מגידו, 2026</p>
            <a href="#top" className="inline-flex items-center gap-1 transition hover:text-foreground"><ArrowUp className="size-4" aria-hidden /> חזרה לראש הדף</a>
          </div>
        </div>
      </footer>
    </>
  )
}
