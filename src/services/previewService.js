// Built-in Curated Packs & iTunes Audio Preview Engine (Slovak & International Oldies Party Hits)

export const PACK_CATEGORIES = [
  { id: 'all', name: 'Все паки' },
  { id: 'slovak', name: '🇸🇰 Slovenské Oldies' },
  { id: 'world', name: '🌍 Svetové Oldies' }
];

export const CURATED_PACKS = [
  // ==========================================
  // 🇸🇰 SLOVENSKÉ OLDIES HITY
  // ==========================================
  {
    id: 'pack_sk_legends',
    category: 'slovak',
    name: '🇸🇰 Slovenské Oldies: Zlaté Legendy',
    subtitle: 'Karol Duchoň, Meky Žbirka, Marika Gombitová, Modus, Peter Nagy',
    emoji: '👑',
    color: 'from-blue-600 to-indigo-700',
    tracks: [
      {
        id: 'sk_1',
        name: 'Čardáš dvoch sŕdc',
        artist: 'Karol Duchoň',
        year: '1976',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/22/32/ca/2232caf4-e071-38e4-36f4-3316727733ba/8584019050826.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/15/eb/36/15eb368b-13f4-b6c8-e58b-0a7f61cc2b5c/mzaf_10020958859934671588.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'sk_2',
        name: 'Biely kvet',
        artist: 'Miroslav Žbirka',
        year: '1982',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/cd/2b/80/cd2b80b1-ecde-a7bd-6f39-6ea3751e2b88/8584019125821.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b7/28/15/b728151b-fff9-0aba-a5b3-ce27e906cbe7/mzaf_18072664042463935747.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'sk_3',
        name: 'Šiel, šiel',
        artist: 'Karol Duchoň',
        year: '1974',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/62/bb/63/62bb63d4-0916-7b17-e5b6-5c6a8ba2d4c3/190295178406.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8f/07/25/8f07253c-16b2-2d54-a58b-91847b1083c1/mzaf_14814616905836568638.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'sk_4',
        name: 'Atlantída',
        artist: 'Miroslav Žbirka',
        year: '1982',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/cd/2b/80/cd2b80b1-ecde-a7bd-6f39-6ea3751e2b88/8584019125821.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/c8/e8/90/c8e89069-5a0d-b2ac-f7f0-6301538cc84c/mzaf_7640148966982142079.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'sk_5',
        name: 'Kristínka iba spí',
        artist: 'Peter Nagy',
        year: '1984',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f9/15/51/f915512b-a951-0e1f-0944-7e68a170e70c/8584019156924.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/b2/ef/04/b2ef043e-d746-857a-3fee-8baa8c632629/mzaf_5914688246673408973.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'sk_6',
        name: 'Vyznanie',
        artist: 'Marika Gombitová',
        year: '1979',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/87/4d/7f/874d7ff4-1b81-147f-93f3-47973a75bef1/8584019085828.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2c/22/3d/2c223dc2-138b-899d-5af3-0a42a4debdf3/mzaf_8509339398897325865.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'sk_7',
        name: 'Dievčatá',
        artist: 'Modus',
        year: '1978',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/62/f5/ad/62f5ad80-0b38-60fb-42d9-3da78b4a4bba/8584019270828.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/62/88/1f/62881fcc-94c1-0fd5-d53e-237878a08618/mzaf_15825901043474859820.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'sk_8',
        name: 'S nohami na stole',
        artist: 'Peter Nagy',
        year: '1985',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/ce/57/47/ce574737-f906-e673-90e8-bb0b950b0d47/cover.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/72/a0/17/72a017a2-c09c-eaf6-a4a6-e4bc03e46086/mzaf_10345491694559317389.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'sk_9',
        name: 'Anča si drahá ako Volvo',
        artist: 'Lojzo',
        year: '1985',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/42/85/7c/42857ca9-37b7-bb98-7a16-e4d0b0ded536/8584019168828.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c6/11/b1/c611b140-21a7-7e3e-7115-1c2925d5a021/mzaf_16317611780717170596.plus.aac.p.m4a',
        source: 'preview'
      }
    ]
  },
  {
    id: 'pack_sk_rock_90s',
    category: 'slovak',
    name: '🇸🇰 Slovenské Oldies: Rock & 80/90-te',
    subtitle: 'Elán, Team, Tublatanka, Richard Müller, Vidiek',
    emoji: '🎸',
    color: 'from-red-600 to-amber-600',
    tracks: [
      {
        id: 'skr_1',
        name: 'Zaľúbil sa chlapec',
        artist: 'Elán',
        year: '1985',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/79/55/ef/7955ef8e-d2f8-c0f4-200d-d6708c331f07/190296216671.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/30/a7/45/30a74580-ceef-3828-a560-6a50fc858435/mzaf_5023874610033072488.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'skr_2',
        name: 'Reklama na ticho',
        artist: 'Team',
        year: '1988',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/e8/67/5e/e8675eaa-4439-5795-fb86-b57f9e96595b/8584019204526.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9c/67/97/9c6797b9-c78f-0e42-ebde-f920f4128ce1/mzaf_8865943807089441819.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'skr_3',
        name: 'Po schodoch',
        artist: 'Richard Müller & Banket',
        year: '1986',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/8f/c2/79/8fc27922-2918-9e5f-3ef7-443c5208b0bd/8584019178629.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9a/9c/7b/9a9c7b68-9295-bd01-ed9b-446276c86fe9/mzaf_2234872653699919873.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'skr_4',
        name: 'Kráľovná bielych tenisiek',
        artist: 'Elán',
        year: '1985',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/79/55/ef/7955ef8e-d2f8-c0f4-200d-d6708c331f07/190296216671.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/83/da/f1/83daf1b7-7cec-9e0f-090f-fc4b70c19457/mzaf_10190130914875809461.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'skr_5',
        name: 'Dnes',
        artist: 'Tublatanka',
        year: '1987',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/3a/c6/fc/3ac6fc36-929b-c107-a44a-758a6aa92332/190295178352.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/9e/e7/ef/9ee7ef43-55a3-1f90-1be0-26eac5233946/mzaf_8422636814221839689.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'skr_6',
        name: 'Vidiečan',
        artist: 'Vidiek',
        year: '1988',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/a9/4a/03/a94a0314-6c57-9176-55bc-53b6d2b148b0/8584019210329.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cb/b4/ae/cbb4ae61-2939-a63d-c0a6-31f4dbbdbc5a/mzaf_5583529966452669241.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'skr_7',
        name: 'Boli sme raz milovaní',
        artist: 'Pavol Habera',
        year: '2000',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/93/3e/cf/933ecf69-a17f-ebf4-0d59-2e602e4e832e/00731454290326.rgb.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/d7/5d/fc/d75dfc21-6bae-920a-3f6c-01dd3a3e19d3/mzaf_6928950852850965288.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'skr_8',
        name: 'Ráno',
        artist: 'Iné Kafe',
        year: '2000',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/0a/4b/bb/0a4bbb03-c65b-4f39-3f3b-302a92cadaaa/190295178468.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/18/8f/0f/188f0fa2-e242-6beb-c38d-c3d5a48a0cf4/mzaf_7718703758005554222.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'skr_9',
        name: 'Voda, čo ma drží nad vodou',
        artist: 'Elán',
        year: '1999',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music22/v4/8a/3e/27/8a3e2786-d47b-388e-4a94-c9f0d59b89c8/190295914479.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1a/88/03/1a880375-164b-25ed-ff6d-1704f2c0fa48/mzaf_14222420114128165799.plus.aac.p.m4a',
        source: 'preview'
      }
    ]
  },

  // ==========================================
  // 🌍 SVETOVÉ OLDIES HITY
  // ==========================================
  {
    id: 'pack_oldies_flagship',
    category: 'world',
    name: '🏆 Svetové Oldies: Hlavné Hity',
    subtitle: 'ABBA, Boney M, Michael Jackson, Queen, Whitney Houston',
    emoji: '🪩',
    color: 'from-amber-400 to-pink-600',
    tracks: [
      {
        id: 'oldies_1',
        name: 'Dancing Queen',
        artist: 'ABBA',
        year: '1976',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/60/f8/a6/60f8a6bc-e875-238d-f2f8-f34a6034e6d2/14UMGIM07615.rgb.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ec/b1/63/ecb163bc-aff2-4dd2-d40b-c044f0b9fa4d/mzaf_4358783485405794088.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'oldies_2',
        name: 'Rasputin',
        artist: 'Boney M.',
        year: '1978',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b7/86/45/b786452a-a723-eaed-8170-cdc261367eb7/886443575578.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c9/f3/1a/c9f31ada-36b3-cbcf-f00d-d71e4e30d3b7/mzaf_778984828701442746.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'oldies_3',
        name: 'September',
        artist: 'Earth, Wind & Fire',
        year: '1978',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5c/8e/19/5c8e191d-b458-fc29-54ef-bd9367835044/886447618547.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/49/2d/44/492d441e-f0ce-5c3a-dcc6-3a892d2600f2/mzaf_2765278844043228646.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'oldies_4',
        name: 'Billie Jean',
        artist: 'Michael Jackson',
        year: '1982',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f4/1f/42/f41f4228-3e4b-9e45-f0bb-113ff1d56fa0/886444081077.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/df/31/54/df31548e-a99f-7ecf-4bf2-cf77ee5db9d6/mzaf_17208753239339304386.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'oldies_5',
        name: 'Bohemian Rhapsody',
        artist: 'Queen',
        year: '1975',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8b/0a/ea/8b0aea60-6f4a-195b-5958-cdf459c2333b/602527644271.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/17/fc/1e/17fc1eba-946d-84a9-710b-a0e88ea64209/mzaf_3049006317693088799.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'oldies_6',
        name: 'I Wanna Dance with Somebody',
        artist: 'Whitney Houston',
        year: '1987',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/86/b5/25/86b525b1-bff1-4bf6-6112-531251b3d672/dj.hthdmusj.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/7b/67/fd/7b67fd07-6a7a-0362-135c-878ac5799f2c/mzaf_11309521725869189721.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'oldies_7',
        name: 'Cheri Cheri Lady',
        artist: 'Modern Talking',
        year: '1985',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music/42/0e/f1/mzi.hokmsaus.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0f/91/22/0f9122fa-cfdb-b494-225c-4a1f62e3f45e/mzaf_10139579085758580031.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'oldies_8',
        name: 'Stayin\' Alive',
        artist: 'Bee Gees',
        year: '1977',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/6d/ed/e9/6dede96a-6c1b-c5bb-001b-e3039195bdbb/00602567067177.rgb.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3f/26/77/3f2677d0-8077-c16a-7eea-7795fa614e0f/mzaf_14501202821130740263.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'oldies_9',
        name: 'Take On Me',
        artist: 'a-ha',
        year: '1985',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/7e/39/19/7e3919e1-6386-8d51-3fa4-358aa093496c/081227096642.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/10/7b/bb/107bbb4f-9e8c-85a7-96a1-a6788dbd1814/mzaf_3179782522646698188.plus.aac.p.m4a',
        source: 'preview'
      }
    ]
  },
  {
    id: 'pack_oldies_disco',
    category: 'world',
    name: '🪩 Svetové Oldies: Zlaté Disko',
    subtitle: 'Boney M, ABBA, Ottawan, Modern Talking',
    emoji: '🕺',
    color: 'from-pink-500 to-purple-600',
    tracks: [
      {
        id: 'disco_1',
        name: 'Daddy Cool',
        artist: 'Boney M.',
        year: '1976',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music4/v4/aa/23/e3/aa23e3a1-de3e-5aa7-870b-a1403afb2b10/886444503273.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/fb/42/23/fb422396-a013-9f73-98bc-208a8980ad78/mzaf_14574164076121768740.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'disco_2',
        name: 'Gimme! Gimme! Gimme!',
        artist: 'ABBA',
        year: '1979',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/60/f8/a6/60f8a6bc-e875-238d-f2f8-f34a6034e6d2/14UMGIM07615.rgb.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5a/15/3d/5a153d97-6516-6002-2b38-4fec70a10c32/mzaf_10077693738786116788.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'disco_3',
        name: 'Brother Louie',
        artist: 'Modern Talking',
        year: '1986',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music/9c/65/46/mzi.ehuzpzfh.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e7/16/c0/e716c07f-8c9a-eaf3-7606-a1c90724d4c6/mzaf_7329994176972075347.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'disco_4',
        name: 'Hands Up',
        artist: 'Ottawan',
        year: '1981',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/d0/be/57/d0be577b-2dab-57eb-644d-59cdf9d28543/5060899077564_cover.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/13/44/d8/1344d863-bfab-ed50-f613-d77c369bcc31/mzaf_2023420626323361947.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'disco_5',
        name: 'The Rhythm of the Night',
        artist: 'Corona',
        year: '1993',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/b9/30/b4/b930b427-e818-a621-e8ea-17a4c7e28b86/8014460002161.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/1f/03/40/1f03407a-4cce-7ba1-9f22-29fc2fec649c/mzaf_17208868694032127161.plus.aac.p.m4a',
        source: 'preview'
      }
    ]
  },
  {
    id: 'pack_oldies_rock',
    category: 'world',
    name: '⚡ Svetové Oldies: Rock & Glam',
    subtitle: 'Queen, AC/DC, Scorpions, Europe, Deep Purple',
    emoji: '🎸',
    color: 'from-amber-500 to-red-600',
    tracks: [
      {
        id: 'rock_1',
        name: 'We Will Rock You',
        artist: 'Queen',
        year: '1977',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3a/25/81/3a258183-09c1-e6ee-b517-258288ca3d03/602527717487.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/0a/a9/f3/0aa9f3af-4672-fb3b-42d8-6d56a9a4c69b/mzaf_16030082968131796908.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'rock_2',
        name: 'Highway to Hell',
        artist: 'AC/DC',
        year: '1979',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b9/c8/ef/b9c8ef42-bbc9-64df-11f8-717571f6730f/886443673458.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d0/54/a9/d054a909-fe00-757a-b5fb-3760ea7cdf13/mzaf_15087080229874880055.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'rock_3',
        name: 'Wind of Change',
        artist: 'Scorpions',
        year: '1990',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/65/29/ca/6529cad4-827a-8aa5-ebbc-f9de2ea33af2/00602567825265.rgb.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/41/c4/56/41c45672-a449-5926-5ece-375cbb782c0a/mzaf_12222004344711432670.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'rock_4',
        name: 'The Final Countdown',
        artist: 'Europe',
        year: '1986',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/64/ff/98/64ff982f-22f3-1002-39c8-d1a2936720fc/886444459033.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/4a/bc/40/4abc400b-6078-4ea7-f834-c7fc01f78ea7/mzaf_8462002517835178619.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'rock_5',
        name: 'Smoke on the Water',
        artist: 'Deep Purple',
        year: '1972',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2d/75/a7/2d75a7c2-11cf-5d46-4cb2-6385d95fe8ea/00602547274025.rgb.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/05/79/11/0579116e-eb2e-84b2-2ea9-42ceae0002b8/mzaf_1079374092572622709.plus.aac.p.m4a',
        source: 'preview'
      }
    ]
  },
  {
    id: 'pack_oldies_90s',
    category: 'world',
    name: '📼 Svetové Oldies: Eurodance 90-te',
    subtitle: 'Ace of Base, Haddaway, Dr. Alban, Aqua, Scatman',
    emoji: '🎧',
    color: 'from-cyan-500 to-blue-600',
    tracks: [
      {
        id: 'euro_1',
        name: 'All That She Wants',
        artist: 'Ace of Base',
        year: '1992',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/be/93/73/be9373d1-31eb-edd0-5818-beb2a7d51868/cover.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/df/cb/dd/dfcbdda6-36f1-ae26-d865-2d144d97f730/mzaf_6455862464087792624.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'euro_2',
        name: 'What Is Love',
        artist: 'Haddaway',
        year: '1993',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/09/25/68/092568f6-fc4a-f35d-8521-36ba97a8a10d/4006180327464_3000.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/e5/22/a3/e522a36d-9653-ff5c-f748-038e2d42df79/mzaf_13506456070624021799.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'euro_3',
        name: 'It\'s My Life',
        artist: 'Dr. Alban',
        year: '1992',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ba/4e/95/ba4e9574-00dd-c45e-6266-6ced2615c32d/0859381174134.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d9/08/ae/d908ae45-48da-63bf-fb7a-bb40bf4a1431/mzaf_5161144510062082665.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'euro_4',
        name: 'Barbie Girl',
        artist: 'Aqua',
        year: '1997',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bf/1a/f1/bf1af1ff-3e42-70b9-1d48-cb75b119a0a1/00602557434556.rgb.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/91/97/ff/9197ffb1-6a2c-f6fa-8da8-3bf481335c0d/mzaf_6190695029094770176.plus.aac.p.m4a',
        source: 'preview'
      },
      {
        id: 'euro_5',
        name: 'Coco Jamboo',
        artist: 'Mr. President',
        year: '1996',
        albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/c3/a2/5d/c3a25d2b-f45d-c6a1-a6ca-864700be9987/706301489063.jpg/600x600bb.jpg',
        audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/ec/3b/b1/ec3bb114-1e5b-c2e3-085e-b24e6c99c8f6/mzaf_1495919420079093848.plus.aac.p.m4a',
        source: 'preview'
      }
    ]
  }
];

// Search songs using Apple iTunes Search API (country=SK prioritizing Slovak/local catalogue)
export async function searchTracksOnline(query) {
  if (!query || query.trim().length === 0) return [];

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&country=sk&media=music&entity=song&limit=25`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Chyba vyhľadávania skladieb');

  const data = await res.json();
  let results = data.results || [];

  // Fallback to global if empty
  if (results.length === 0) {
    const globalRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=25`);
    if (globalRes.ok) {
      const gData = await globalRes.json();
      results = gData.results || [];
    }
  }

  return results
    .filter(item => item.previewUrl)
    .map(item => ({
      id: `itunes_${item.trackId}`,
      name: item.trackName,
      artist: item.artistName,
      albumArt: (item.artworkUrl100 || '').replace('100x100bb', '600x600bb'),
      year: item.releaseDate ? item.releaseDate.substring(0, 4) : '—',
      audioUrl: item.previewUrl,
      source: 'preview'
    }));
}

// HTML5 Audio Controller for 30s previews
class PreviewPlayerService {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.timeoutId = null;
    this.onEndedCallback = null;
  }

  play(audioUrl, durationSeconds = 10, onEnded = null) {
    this.stop();
    this.onEndedCallback = onEnded;

    this.audio.src = audioUrl;
    this.audio.currentTime = 0;

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (durationSeconds && durationSeconds > 0) {
            this.timeoutId = setTimeout(() => {
              this.stop();
              if (this.onEndedCallback) this.onEndedCallback();
            }, durationSeconds * 1000);
          }
        })
        .catch(err => {
          console.warn('Playback interrupted:', err);
        });
    }

    this.audio.onended = () => {
      this.stop();
      if (this.onEndedCallback) this.onEndedCallback();
    };
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.audio) {
      this.audio.pause();
    }
  }

  pause() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.audio.pause();
  }

  resume(remainingSeconds) {
    this.audio.play();
    if (remainingSeconds > 0) {
      this.timeoutId = setTimeout(() => {
        this.stop();
        if (this.onEndedCallback) this.onEndedCallback();
      }, remainingSeconds * 1000);
    }
  }

  setVolume(vol) {
    this.audio.volume = Math.max(0, Math.min(1, vol));
  }
}

export const previewPlayer = new PreviewPlayerService();
