// photos are placeholders — drop real files in src/assets/images/<category>/
// and swap null entries for imported paths once ready. Leave null for anything
// with no photo yet — it renders as a dim "no photo" tile rather than being hidden.

const unlistedSkills = [
  {
    id: 'mechanic',
    icon: '🔧',
    accent: 'blue',
    title: 'Mechanic',
    paragraph:
      "I've always liked figuring out how things work, which is probably why I ended up fixing all kinds of things around me. Mostly motorcycles and bicycles — but also broken appliances, electric fans, and whatever else I can take apart, clean, troubleshoot, and hopefully get working again. I'm not a professional mechanic. I just hate paying someone to do something I could learn to do myself. I've kept things running on my own over the years, learning mostly by doing, making mistakes, and figuring out what actually works.",
    tagsLabel: 'Services',
    tags: ['CVT cleaning', 'Tune-ups', 'Tuning'],
    photoStripLabel: "Work I've done",
    photos: [null, null, null]
  },
  {
    id: 'technician',
    icon: '📱',
    accent: 'teal',
    title: 'Technician',
    paragraph:
      "I've always liked taking things apart and figuring out how they work. I started with phone repair and buy-and-sell as a hobby — fixing broken phones for family for free, then buying and selling phones on the side. It was also a good excuse to try out different phones while making a little extra money along the way. That eventually got me into working on PCs too. Repasting, upgrading parts, cleaning them up, and building PCs from scratch. I'm not a certified technician, and I never took a course for any of it. The buy-and-sell started as a simple hobby, but I ended up enjoying it enough to keep going. I still like checking out different units, figuring out what's wrong with them, and finding those deals that are actually worth taking.",
    tagsLabel: 'Services',
    tags: ['PC building', 'Thermal repasting', 'Part upgrades', 'Phone screen/battery repair'],
    photoStripLabel: "Work I've done",
    photos: [null, null, null]
  },
  {
    id: 'video-editing',
    icon: '🎬',
    accent: 'amber',
    title: 'Video Editing',
    paragraph:
      "I've been getting more serious about video editing recently, mainly through a free training program where I've been learning Premiere Pro and CapCut for ad editing. I've also been doing editing and AI prompt work for a YouTube automation project I run on the side, so I'm actually using what I learn instead of just watching tutorials and leaving it at that. It's still a newer skill for me compared to web development and the other things I've been doing, but I'm putting real time into it and actively trying to get better.",
    tagsLabel: 'Tools',
    tags: ['Premiere Pro', 'CapCut']
    // no photos field — Video Editing has no photo strip per spec
  }
]

export default unlistedSkills