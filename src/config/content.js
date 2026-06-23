// config/content.js
// ⚠️ SANTHOSH FILLS ALL VALUES BELOW BEFORE DEPLOYING

export const HERO = {
  nicknames: ['Sneha 🌹', 'My Favorite Person ✨', 'Snehhh ❤️'],
  subline: 'Miles apart, but closer to my heart than anyone else.',
  body: 'No distance, no screens, no waiting. Just a quiet space for us.',
  cta: 'Step inside 👇',
  stickyNote: 'every single line was written thinking of you.',
}

export const PHOTOS = [
  { id: 1, src: '/assets/photos/1.jpeg', caption: 'the first time i saw your face', date: 'Feb 2026' },
  { id: 2, src: '/assets/photos/2.jpeg', caption: 'you are glowingg!!!', date: 'Mar 2026' },
  { id: 3, src: '/assets/photos/3.PNG', caption: 'It might just be an AI creation, but the way you\'re looking at me completely melts my heart. I would die for that expression', date: 'Apr 2026' },
  { id: 4, src: '/assets/photos/4.jpeg', caption: 'you take my breath away every single time, without even trying', date: 'May 2026' },
  { id: 5, src: '/assets/photos/5.jpeg', caption: 'An actual goddess walking among us', date: 'Forever' },
]

// ⚠️ SANTHOSH: Set this to the day you first met Sneha (YYYY-MM-DD)
export const SINCE_YOU = {
  startDate: '2026-02-20', // Change this to your actual date!
  since: 'since the day we first talked —',
  subtitle: '...and the distance hasn\'t mattered for a single second.',
  feelings: [
    {
      emoji: '✨',
      title: 'You changed everything',
      note: 'I didn\'t expect you. I wasn\'t looking. And then you sent that first message, and suddenly everything I thought I knew about life felt different. Better.',
    },
    {
      emoji: '🌙',
      title: 'Staring at the same moon',
      note: 'Even though there are miles between us, we are looking at the exact same sky. Hearing your voice at night makes the entire world fade away.',
    },
    {
      emoji: '🤍',
      title: 'I choose you, every day',
      note: 'It\'s not physical presence that makes love real. It\'s this quiet, certain thing I feel every morning when I wake up to your texts.',
    },
    {
      emoji: '🌹',
      title: 'Waiting for that day',
      note: 'There is a specific warmth that only you bring through the screen. I can only imagine how it will feel when I finally get to hold you.',
    },
  ],
}

export const INSIDE_JOKES = [
  { id: 1, title: 'late night texts', context: 'your messages at midnight are the only reason i sleep with a smile on my face', color: 'cream', locked: false },
  { id: 2, title: 'teasing her', context: 'my love language is annoying you until you laugh. works every time.', color: 'cream', locked: false },
  { id: 3, title: '11:11 wish', context: 'every single 11:11, without fail. i wish for the day i finally get to see you.', color: 'cream', locked: false },
  { id: 4, title: 'your typing habit', context: 'how i can tell exactly what your mood is just by the way you text', color: 'cream', locked: false },
  { id: 5, title: 'home', context: 'she is the one i feel at home with. not a place. just her.', color: 'cream', locked: false },
  { id: 6, title: 'when you go offline', context: 'the whole world feels a little quieter and a lot emptier. i hate it.', color: 'cream', locked: false },
]

export const APPRECIATIONS = [
  { id: '01', text: 'the gentle way you care for me, even from so far away', emoji: '🌸' },
  { id: '02', text: 'how your face lights up through the screen when you smile', emoji: '✨' },
  { id: '03', text: 'the complete peace i feel just being on call with you in silence', emoji: '🤍' },
  { id: '04', text: 'your voice. it is literally my favorite sound in the world.', emoji: '🎶' },
  { id: '05', text: 'how you make me feel so close to you despite the miles between us', emoji: '🦋' },
  { id: '06', text: 'the way you text me the smallest, most random updates about your day', emoji: '🫂' },
  { id: '07', text: 'your kindness. it translates through every message you send.', emoji: '💫' },
  { id: '08', text: 'the way a single text from you can completely change the mood of my entire day', emoji: '💬' },
  { id: '09', text: 'how safe you make me feel when the world gets loud', emoji: '🏰' },
  { id: '10', text: 'just you. exactly as you are. completely and entirely.', emoji: '🌹' },
]

export const SCRATCH_CARD = {
  label: 'clear the velvet to see my promise...',
  reveal: 'i promise to never stop looking at you the way i did the very first time. i promise that the wait will be worth it. i promise that the day i finally get to hug you will be the best day of my life. i am entirely yours. 🤍',
}

export const CONSTELLATION = {
  node1: "The moment I realized a screen couldn't stop me from falling for you.",
  node2: "Your voice is, and will always be, my absolute favorite sound in the world.",
  node3: "Thank you for being my anchor, my peace, and my home. I love you.",
}

export const PLAYLIST = [
  { 
    title: 'Until I Found You', 
    artist: 'Stephen Sanchez', 
    // Make sure your downloaded mp3 is named "song.mp3" and placed inside public/assets/audio/
    src: '/assets/audio/song.mp3', 
    lyrics: [
      { time: 0, text: "(Music playing...)" },
      { time: 12, text: "Georgia, wrap me up in all your..." },
      { time: 17, text: "I want ya, in my arms" },
      { time: 23, text: "Oh, let me hold ya" },
      { time: 27, text: "I'll never let you go again, like I did" },
      { time: 33, text: "Oh, I used to say" },
      { time: 37, text: "I would never fall in love again until I found her" },
      { time: 44, text: "I said, I would never fall unless it's you I fall into" },
      { time: 50, text: "I was lost within the darkness, but then I found her" },
      { time: 57, text: "I found you" },
      { time: 65, text: "(Music playing...)" },
      { time: 75, text: "Heaven, when I held you again" },
      { time: 81, text: "How could we ever just be friends?" },
      { time: 87, text: "I would rather die than let you go" },
      { time: 93, text: "Juliet to your Romeo" },
      { time: 98, text: "How I heard you say" },
      { time: 101, text: "I would never fall in love again until I found her" },
      { time: 107, text: "I said, I would never fall unless it's you I fall into" },
      { time: 114, text: "I was lost within the darkness, but then I found her" },
      { time: 121, text: "I found you" },
      { time: 126, text: "(Guitar solo...)" },
      { time: 145, text: "I would never fall in love again until I found her" },
      { time: 152, text: "I said, I would never fall unless it's you I fall into" },
      { time: 158, text: "I was lost within the darkness, but then I found her" },
      { time: 166, text: "I found you" },
      { time: 173, text: "✨ 🤍 ✨" },
    ]
  },
]

export const LETTER = {
  body: `hey sneha,

i wanted to make something for you. not just a text or a call, but a space that belongs only to us, free from the distance.

you brought a kind of light into my life that i didn't know i was missing. every quiet moment on call, every late-night message, every time i hear you laugh through the speakers—it all just confirms what i already know. you are it for me.

even though we haven't met in person yet, you are the most real thing in my life. distance means absolutely nothing when someone means everything. i can't wait for the day i finally get to pull you into my arms. 

you're my favorite part of every day.

forever yours,
            — Santhosh ❤️`,
}

export const EASTER_EGG = {
  message: `you found my hidden heart. 
  
just a quiet little reminder: you are the most beautiful thing that has ever happened to me, and the wait will be so, so worth it.

i love you. ❤️`,
}
