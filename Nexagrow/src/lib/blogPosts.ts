import { BRAND } from '@/lib/brand';

export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  blocks: BlogBlock[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'our-story',
    title: 'Our Story: Why We Started',
    excerpt:
      `Five farmer-directors in ${BRAND.farmLocation}, built ${BRAND.name} to keep ownership with the people who work the soil—and to back every claim with a short, verifiable supply chain.`,
    date: 'Jan 15, 2026',
    readTime: '8 min',
    category: 'Our Story',
    image: '/farm.jpg',
    blocks: [
      {
        type: 'paragraph',
        text: 'In most agricultural supply chains, the people who work the soil have the least say in what their crop becomes, how it is sold, and what it earns. A farmer manages the harvest and delivers the crop, but ownership passes to others from that exact point.',
      },
      {
        type: 'paragraph',
        text: `${BRAND.name} began because five of us, farming in Uttar Pradesh, simply disagreed with that arrangement. We had been cultivating moringa in our village, Kanewra in Prayagraj district, for years. We understood the plant, the soil, and the seasonal rhythms. There was no reason why our community's skills should earn a fraction of what the product was worth by the time it reached a consumer.`,
      },
      {
        type: 'paragraph',
        text: 'At the same time, people buying moringa powder were being asked to trust labels like "Pure," "Natural," or "Organic" without any real mechanism to verify them. We realized we could address both problems at once. We wanted to build a company where farmers hold ownership over the value they create, and where every claim made to a customer is backed by a short, verifiable supply chain.',
      },
      {
        type: 'callout',
        text: 'To us, these are the exact same goal, approached from either end.',
      },
      { type: 'heading', text: 'Who We Are' },
      {
        type: 'paragraph',
        text: `To turn this idea into a reality, we chose a specific legal structure in India that keeps control entirely with the producers. In January 2026, we incorporated ${BRAND.name} as a Farmer Producer Company (CIN: ${BRAND.cin}).`,
      },
      {
        type: 'paragraph',
        text: 'We are not a brand built by external entrepreneurs who contract farmers at the back end. This company is owned and operated directly by the five founding farmer-directors who live and work the land in Kanewra, a village in the Prayagraj district of Uttar Pradesh.',
      },
      {
        type: 'list',
        items: [
          '5 Farmer-Directors — Five founding farmers who live here, work the land, and own the enterprise.',
          'Kanewra, Uttar Pradesh — A single village in Prayagraj district. This is where the company is registered, the crop grows, and all decisions are made.',
          'Hands-on Management — The founders personally handle everything from soil preparation and irrigation to milling and packaging. There is no head office elsewhere drawing conclusions about what happens on our soil.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Soil preparation, harvest scheduling, shade-drying, cold-pressing, and packaging are not separate corporate departments. We are the same group of people working across every stage in the very same village.',
      },
      { type: 'heading', text: 'How We Work the Land' },
      {
        type: 'paragraph',
        text: `Every ${BRAND.name} product originates from ${BRAND.khasra}, a single agricultural plot here in Kanewra. We cultivate moringa exclusively. Rather than managing a rotating crop calendar designed to scale up quickly, we focus on a single plant on a piece of land we know in detail.`,
      },
      {
        type: 'list',
        items: [
          'The Soil — We maintain the land using composts and microbial preparations made directly on the farm. Synthetic pesticides, chemical fertilizers, and GMO seeds have never been part of our farming approach.',
          'The Drying Process — After the harvest, leaves are hand-picked and shade-dried on raised platforms inside the village. Direct sun and high heat degrade vitamin C and sensitive antioxidants. Keeping temperatures low during drying is the only way to preserve the native quality of what we grow.',
          'The Packaging — Milling, capsule filling, cold-pressing, and packaging all take place within our village facility, operating under a unit compliant with FSSAI standards. The seed oil goes from the press straight to the bottle without ever leaving Kanewra, and our powders and capsules follow the exact same path.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Because the same hands grow, process, and pack the product, the crop never passes between unrelated parties. What we describe on the label is exactly what is inside, because we are the ones who put it there.',
      },
      { type: 'heading', text: 'What This Means For You' },
      {
        type: 'paragraph',
        text: `When you buy from ${BRAND.name}, you are dealing with a business where the farmer and the owner are the same person. This is a practical reality written directly into how our company was incorporated. For you, this means your purchase reaches the people who worked the soil directly, instead of being filtered through multiple corporate layers of a supply chain. The margin stays with the growers.`,
      },
      { type: 'heading', text: 'Absolute Traceability' },
      {
        type: 'paragraph',
        text: 'Every product is grown on one named plot, in one village, by a small group of people you can contact directly by email. If you have a question about how the moringa was cultivated, dried, or processed, the person answering your email was physically there when it happened. For a product you put into your body every morning, that kind of connection to origin is not an extra. It is the point.',
      },
      { type: 'heading', text: 'The Nexa Way' },
      {
        type: 'paragraph',
        text: 'Every decision we have made since incorporation comes back to a single question: does this keep ownership with the farmers, and does it keep the product honest?',
      },
      {
        type: 'list',
        items: [
          'We do not expand beyond moringa because we want to stay exceptionally good at this one thing.',
          'We do not bring in outside processing because our own facility allows us to personally vouch for everything that happens inside it.',
          'We do not add layers to our supply chain because every layer moves value away from the people who created it.',
        ],
      },
      {
        type: 'paragraph',
        text: `We think the best version of a food company is one where the people who grow the food own the company, control the process, and deal directly with the people who buy it. That is what ${BRAND.name} is. It is also, we think, what food should be.`,
      },
      {
        type: 'callout',
        text: 'If this matches the kind of company you want to support, we are glad to have you here.',
      },
      {
        type: 'list',
        items: [
          `Email: ${BRAND.email}`,
          'Location: Kanewra, Prayagraj District, Uttar Pradesh',
          `Corporate Identity: CIN: ${BRAND.cin}`,
        ],
      },
    ],
  },
  {
    slug: 'moringa-body-evidence',
    title: 'What Moringa Actually Does to Your Body: Separating Hype from Hard Evidence',
    excerpt:
      'Walk past any health food aisle and moringa is sold like a cure-all. The science is more grounded—and in some ways more interesting—than the marketing suggests.',
    date: 'Feb 3, 2026',
    readTime: '12 min',
    category: 'Wellness',
    image: '/capsule.webp',
    blocks: [
      {
        type: 'paragraph',
        text: "Walk into a health food store, and you'll find moringa powder sitting right between ashwagandha and spirulina, usually packaged in a way that makes it sound like some rediscovered cure-all. Wellness culture has treated this plant as something between a missing chapter of Ayurveda and a supplement company's dream product. The actual science is more grounded, and honestly, in some ways more interesting than the marketing suggests.",
      },
      {
        type: 'paragraph',
        text: "Moringa is a genuinely nutritious food with real, documented effects on metabolic health. It's also a plant whose biggest claims still rest heavily on animal data and small clinical trials. Knowing the difference between those two things is what matters here.",
      },
      { type: 'heading', text: 'A Concentrated Food Source, Not Your Usual Supplement' },
      {
        type: 'paragraph',
        text: "Let's start with what moringa actually is, structurally. Moringa oleifera is a fast-growing tree native to South Asia. The leaves are the part that's been studied and consumed the most, usually dried and ground into a dark green powder. What sets this leaf apart from most plant foods is just how much it packs into a small amount of dry weight.",
      },
      {
        type: 'list',
        items: [
          'Protein: 25% to 30% of dry weight',
          'Vitamin C: Approximately 200 mg per 100 grams',
          'Calcium: 440 mg',
          'Iron: 7 mg',
          'Other Key Nutrients: Meaningful quantities of beta-carotene and potassium',
        ],
      },
      {
        type: 'paragraph',
        text: "That protein number comes with an important footnote. Moringa contains all nine essential amino acids, which puts it in a pretty rare category for a plant source. Most plant proteins are incomplete — the body can't make certain amino acids from them on its own. So practically speaking, that matters a lot for anyone on a plant-based diet who's struggling to get enough protein diversity.",
      },
      {
        type: 'paragraph',
        text: "These nutrients are also considered highly bioavailable, meaning the body actually absorbs and uses them efficiently rather than letting most of it pass through unused. If someone is quietly running low on iron or calcium without realizing it, which is common, especially in women and in people avoiding dairy, moringa's concentration of these minerals in a bioavailable form makes it a more practical fix than a lot of fortified foods out there.",
      },
      {
        type: 'paragraph',
        text: "None of this is magic, to be clear. It's dense nutrition, the same category as liver or sardines, just coming from a plant instead.",
      },
      { type: 'heading', text: 'The Inflammation Research' },
      {
        type: 'paragraph',
        text: 'Chronic, low-grade inflammation sits underneath a long list of modern diseases, type 2 diabetes, cardiovascular disease, certain cancers, several autoimmune conditions. Moringa\'s chemical profile makes it a candidate for modulating some of those pathways. The leaf is rich in quercetin, kaempferol, and chlorogenic acid, three flavonoids with well-established anti-inflammatory activity in lab settings.',
      },
      {
        type: 'list',
        items: [
          'The 2025 Evidence: A recent review in Frontiers in Pharmacology pulled together twenty-six separate systematic reviews, and across that whole body of evidence, moringa leaf extracts were consistently tied to lower levels of C-reactive protein, or CRP, which is the standard blood marker we use for systemic inflammation.',
          'Brain and Cognition: On the brain and cognition side, early preclinical work suggests moringa\'s antioxidants might reduce oxidative damage in hippocampal tissue, and theoretically that connects to cognitive aging. But here\'s the honest caveat: don\'t read a lower CRP as a treatment for any specific inflammatory condition. And on the brain health side, those findings are coming from animal models and cell studies only.',
        ],
      },
      { type: 'heading', text: 'Blood Sugar: One Study Does Not Make a Consensus' },
      {
        type: 'paragraph',
        text: 'This is a part where I want to be careful, because the claims circulating online about moringa and blood sugar tend to oversimplify what the research actually shows.',
      },
      {
        type: 'paragraph',
        text: "The most-cited trial here is a double-blind, randomized, placebo-controlled study done in Spain. Adults with prediabetes took twenty-four hundred milligrams a day of dried moringa leaf powder, that's six capsules, for twelve weeks. The moringa group showed statistically significant drops in both fasting blood glucose and HbA1c, which is the measure of average blood sugar over roughly three months, while the placebo group actually drifted in the opposite direction. It's a well-designed trial, and the results are genuinely encouraging.",
      },
      {
        type: 'paragraph',
        text: "What gets less attention is the bigger picture. A meta-analysis of randomized controlled trials, published in Nutrients, found no statistically significant reduction in fasting blood glucose or HbA1c once you pool the data across all the eligible trials. The authors pointed out that individual trials varied a lot, different populations, different metabolic baselines, different durations, different formulations of moringa.",
      },
      {
        type: 'paragraph',
        text: "So here's the honest read on this. Moringa shows real promise for blood sugar specifically in people with prediabetes, where the metabolic disruption is still reversible and the intervention window may be at its best. In people with established type 2 diabetes who are already on medication, the evidence is weaker and thinner. Moringa is not a substitute for metformin, and it's not a substitute for an overhaul of the diet.",
      },
      { type: 'heading', text: 'Cholesterol and Cardiovascular Markers' },
      {
        type: 'paragraph',
        text: 'The lipid data is more consistent than the blood sugar data. A randomized clinical trial published in the International Journal of Food Science and Technology followed overweight adults with high cholesterol who took moringa leaf powder capsules daily for eight weeks.',
      },
      {
        type: 'list',
        items: [
          'LDL Cholesterol: Fell by roughly eleven percent compared to the control group.',
          'Total Cholesterol: Dropped by about nine percent.',
          'HDL Cholesterol: Trended upward in some analyses, though that particular finding varies from study to study.',
        ],
      },
      {
        type: 'paragraph',
        text: "The mechanism being studied has to do with how moringa influences the way the gut handles dietary fat and cholesterol. Animal studies suggest moringa compounds increase the amount of cholesterol excreted in stool, which reduces how much gets reabsorbed back into circulation. An eleven percent drop in LDL from a food supplement over eight weeks, I'd call that modest but meaningful in preventive cardiology, particularly for someone with borderline numbers who isn't yet a candidate for a statin. But if someone's LDL is already in the range where a doctor would typically prescribe medication, moringa powder is not a replacement strategy for that.",
      },
      { type: 'heading', text: 'What the Liver Data Actually Shows' },
      {
        type: 'paragraph',
        text: "One of the bolder claims floating around about moringa is that it protects and supports the liver, often framed in consumer content as a kind of natural detox agent. There's some real science underneath that, but it comes with a significant qualifier that tends to get dropped along the way.",
      },
      {
        type: 'paragraph',
        text: "Studies in rodent models have consistently shown that moringa leaf extract, given either before or after a toxic challenge, reduces liver enzyme markers of damage and restores glutathione levels. Glutathione is the liver's main natural antioxidant. The compounds doing the work here appear to be quercetin, chlorogenic acid, and moringa's isothiocyanates, which activate detoxification enzymes.",
      },
      {
        type: 'paragraph',
        text: "The catch is that essentially all of this evidence comes from animal and in-vitro models. Well-controlled human clinical trials on moringa's liver-protective effects are still limited, and they don't yet establish a clinical benefit with any real confidence. So calling moringa a confirmed liver protector for humans is, right now, ahead of where the evidence actually stands.",
      },
      { type: 'heading', text: 'The Energy Question' },
      {
        type: 'paragraph',
        text: "A lot of people who start taking moringa daily say they feel more energetic within a few weeks. That's not necessarily a pharmacological effect in the conventional sense. Moringa's combination of iron and B vitamins directly supports the cellular machinery that converts food into ATP, which is the body's energy currency. If someone was running low on iron, and that's a widespread subclinical issue, particularly in women, correcting that deficiency through a bioavailable food source would plausibly produce a noticeable bump in energy and mental clarity.",
      },
      {
        type: 'paragraph',
        text: "That's not moringa doing some exotic biochemistry. That's just nutrition doing what nutrition does. And this distinction matters, because moringa doesn't contain caffeine or any known stimulant compound. When people do feel an energy effect, it's downstream of better nutritional status, not some independent stimulant action. Which actually makes it more sustainable in the long run, there's no tolerance building up, no withdrawal, and no crash.",
      },
      { type: 'heading', text: 'What to Take From All of This' },
      {
        type: 'paragraph',
        text: "Moringa is a nutrient-dense leafy vegetable with legitimate, peer-reviewed evidence behind its effects on inflammation markers, cholesterol, and blood sugar in specific populations. It's not a pharmaceutical intervention, and it shouldn't be positioned as one. Most of the bigger claims, particularly around liver protection and brain health, are still supported mainly by animal studies that haven't yet been replicated in large-scale human trials.",
      },
      {
        type: 'paragraph',
        text: "The practical case for moringa is simpler, and less dramatic, than the supplement industry's version of it. It delivers a concentrated dose of vitamins, minerals, and anti-inflammatory compounds in a small daily amount, with a reasonable body of evidence pointing to metabolic benefits for people managing borderline cholesterol or blood sugar. For most people eating a typical diet with its predictable gaps, that's a genuinely useful thing. Not a miracle. But not just marketing either.",
      },
    ],
  },
  {
    slug: 'moringa-sustainability',
    title: 'Why Moringa Might Be One of the Most Sustainable Crops on the Planet',
    excerpt:
      'Beyond nutrition, moringa may be one of the most climate-resilient crops available—useful for water treatment, soil restoration, and rural income generation.',
    date: 'Feb 20, 2026',
    readTime: '10 min',
    category: 'Impact',
    image: '/farms-moringa-tree.png',
    blocks: [
      {
        type: 'paragraph',
        text: "Most conversations about moringa start and end with nutrition: the vitamin C, the amino acids, the iron. But there's a second story here that gets far less attention. Moringa may be one of the most genuinely climate-resilient crops available to agriculture today, and its usefulness stretches well beyond the dinner table into water treatment, soil restoration, and rural income generation. This is the case for moringa as an environmental tool, not just a supplement.",
      },
      { type: 'heading', text: 'A Tree Built for a Hotter, Drier World' },
      {
        type: 'paragraph',
        text: "The core sustainability claim about moringa rests on its biology, and that claim holds up under scrutiny. Rather than relying on vague plant-marketing language, one review traced Moringa oleifera's drought tolerance to concrete physical and genetic adaptations. The tree uses an extensive root system to pull moisture from deep underground, regulates its stomata to manage water loss, and accumulates osmoprotectants like proline to keep its cells functioning under severe water stress.",
      },
      {
        type: 'paragraph',
        text: "On a genetic level, the plant activates specific drought-responsive genes and stress proteins to stay productive when water disappears. This resilience isn't confined to its native regions, either. Field trials are pushing moringa into agricultural systems well outside South Asia. In Sicily, for instance, researchers testing the tree in semi-arid Mediterranean zones describe it as a highly promising alternative for farmers battling rising temperatures, erratic rainfall, and degraded soil, the exact conditions where traditional Mediterranean crops are beginning to fail.",
      },
      {
        type: 'paragraph',
        text: "Because this fast-growing tree is native to northwest India, its natural adaptability to arid environments makes it a serious candidate for regions facing severe water scarcity. The same logic is driving its adoption across the Sahel, where climate pressure on conventional farming is already intense. Because it grows rapidly, resists extreme heat, and survives intense dry spells, Moringa oleifera has become a vital crop for dryland food production.",
      },
      { type: 'heading', text: 'A Genuine Alternative to Failing Row Crops' },
      {
        type: 'paragraph',
        text: "Part of what makes moringa so attractive in a changing climate is a harsh reality most food-security discussions overlook: our global food system is dangerously narrow. Roughly 70% of the world's food comes from just three grains, rice, wheat, and corn, while 80% of our plant-based diet relies on a mere 12 plants and four tubers. This heavy concentration leaves us vulnerable. Many conventional crops aren't indigenous to the areas where smallholders grow them, meaning they require expensive inputs, heavy irrigation, and intense land preparation to yield a profit, making them easy targets for drought.",
      },
      {
        type: 'paragraph',
        text: "Trees, on the other hand, tend to stand strong through the exact weather shifts that ruin annual row crops. For smallholder farmers in dry regions, a single failed harvest can mean months of hardship and malnutrition. Moringa bridges this gap well because it matures fast, often bearing fruit within just six to eight months of planting. That's a remarkably quick turnaround for a tree, letting it provide food and income long before other perennial options can deliver.",
      },
      { type: 'heading', text: 'Restoring Soil, Not Just Surviving It' },
      {
        type: 'paragraph',
        text: "Moringa's environmental value goes beyond surviving tough weather; it actively improves the land around it. Its roots pull double duty: while they search deep for water, they also stabilize the ground, preventing erosion in dry or desertifying areas. As the tree naturally drops its leaves, they decompose and return organic matter to the earth, gradually restoring fertility to soils that are otherwise depleted.",
      },
      {
        type: 'paragraph',
        text: "Research also highlights moringa's role in nitrogen cycling when intercropped with other plants, essentially acting as a natural, low-input fertilizer for neighboring crops. Because it thrives in so many different soil types, it's uniquely suited for farming communities where climate-driven shocks are becoming a regular occurrence. There's also a carbon benefit. Because moringa grows so rapidly, it effectively captures and stores atmospheric carbon during its growth spurts. Since it can be planted at scale on marginal land that can't support normal agriculture, it offers a real, complementary tool for climate mitigation.",
      },
      { type: 'heading', text: 'Genuinely Useful Water Purification' },
      {
        type: 'paragraph',
        text: "One of the most surprising applications of moringa has nothing to do with nutrition. Crushed moringa seeds contain a specific protein that acts as a natural coagulant. When added to dirty water, it binds to floating particles and pulls them to the bottom, creating a low-cost alternative to industrial chemical treatments. This isn't a new wellness-trend discovery. Communities in Sudan have relied on moringa to purify water for decades, long before scientists studied it in a lab.",
      },
      {
        type: 'list',
        items: [
          'Turbidity reduction: One study found a moringa seed treatment reduced river water cloudiness by up to 89.19% at a concentration of 400 mg per liter.',
          'Bacteria removal: The same dosage knocked out up to 98.65% of bacterial counts in wastewater, holding its own against alum, the standard chemical coagulant used globally.',
          'No toxic waste: Unlike chemical treatments, per one review, these natural seed proteins efficiently remove cloudiness and toxic ions without leaving behind hazardous, sludge-like chemical byproducts.',
          'High durability: Per early research, the active protein is tough, remaining stable and effective even after being heated at 95°C for five hours.',
        ],
      },
      {
        type: 'paragraph',
        text: 'For resource-strapped regions, the economics are simple. Moringa seeds are cheap and readily available, making clean water economically viable for communities cut off from modern infrastructure.',
      },
      { type: 'heading', text: 'An Income Source, Not Just an Input' },
      {
        type: 'paragraph',
        text: 'The economic benefits of moringa reinforce its environmental perks. A single tree can provide a smallholder family with multiple streams of income:',
      },
      {
        type: 'list',
        items: [
          'Leaves and pods can be sold fresh or dried for food.',
          'Seeds can be pressed into high-value oil for cooking and cosmetics.',
          'Flowers support local beekeeping and honey production.',
          'The leftover seed cake, what remains after pressing out the oil, makes excellent, nutrient-rich livestock feed, saving farmers from buying commercial feed.',
        ],
      },
      {
        type: 'paragraph',
        text: "This variety matters. If a family grows moringa alongside their standard crops, they aren't relying on a single harvest. If one crop fails, the moringa gives them a financial cushion to fall back on.",
      },
      { type: 'heading', text: 'The Honest Caveats' },
      {
        type: 'paragraph',
        text: "None of this means moringa is a cure-all. Per one review, commercial cultivation has been slowed by a lack of research investment compared to major staples like corn or wheat. The tree isn't invincible, either; young moringa seedlings are highly vulnerable to spider mites, which can cause severe wilting and kill the plants entirely. The natural bitterness in the leaves of certain varieties also makes them a tough sell in some markets, which is why current breeding projects are focusing heavily on improving flavor alongside yield.",
      },
      {
        type: 'paragraph',
        text: "Finally, while moringa's water-purification abilities are impressive, they're a practical, low-cost bridge for developing communities, not a permanent substitute for real water infrastructure.",
      },
      { type: 'heading', text: 'The Bigger Picture' },
      {
        type: 'paragraph',
        text: "What makes moringa compelling isn't any single feature on its own. Plenty of plants handle drought well, and there are other natural water clarifiers out there. The real strength of moringa is that it bundles drought resilience, soil health, water purification, rapid growth, and multiple income streams into a single, easy-to-grow tree. Per African research, it thrives precisely where climate and food security pressures are hitting hardest, which is exactly why development organizations and scientists keep coming back to it.",
      },
      { type: 'heading', text: 'Sources' },
      {
        type: 'list',
        items: [
          'Mechanisms of drought tolerance in Moringa: Strategies for mitigation and adaptation, Plant Science Today',
          'Moringa oleifera Lam.: A versatile climate-smart plant for nutritional security and therapeutic usage in semi-arid regions, ScienceDirect',
          'Preliminary results of Moringa oleifera Lam. grown in a semi-arid Mediterranean environment in a climate change scenario, Frontiers in Sustainable Food Systems',
          'Exploring the benefits of Moringa oleifera Lam. and its contribution to strengthening resilience in the Sahel, Cogent Journals',
          'Terry Exports, Moringa to Combat Climate Change',
          'Evaluation of Moringa oleifera seeds as a natural solution compared to alum for combatting common aquatic pathogenic bacteria, Applied Water Science',
          'The Dual Performance of Moringa Oleifera Seeds as Eco-Friendly Natural Coagulant and Antimicrobial for Wastewater Treatment, Sustainability (MDPI)',
          'Ndabigengesere, A., et al., Quality of water treated by coagulation using Moringa oleifera seeds, ScienceDirect',
          'El Bilali, H., et al., Research on Moringa (Moringa oleifera Lam.) in Africa, Plants',
        ],
      },
    ],
  },
];

export const blogPostsBySlug = Object.fromEntries(
  blogPosts.map((post) => [post.slug, post])
) as Record<string, BlogPost>;
