/* What is in the closet: one line per piece, in the order they hang, left to right.
   kind picks the cut (see garments.js), colour is the cloth as #rrggbb, group is the tab it is listed under.
   To add a piece, copy a line and change it. */
window.DREAM_CLOTHES = [
  { name: 'White T-shirt',  group: 'T-shirts', kind: 'tee',   colour: '#f1f0ec', note: 'Crew neck · cotton jersey' },
  { name: 'Black T-shirt',  group: 'T-shirts', kind: 'tee',   colour: '#1b1b1d', note: 'Crew neck · cotton jersey' },
  { name: 'Beige T-shirt',  group: 'T-shirts', kind: 'tee',   colour: '#d6c4a4', note: 'Crew neck · cotton jersey' },
  { name: 'Grey T-shirt',   group: 'T-shirts', kind: 'tee',   colour: '#b4b5b7', note: 'Crew neck · heather jersey', fabric: 'fleece' },

  { name: 'White shirt',    group: 'Shirts',   kind: 'shirt', colour: '#f4f3f0', note: 'Button-up · cotton poplin' },
  { name: 'Black shirt',    group: 'Shirts',   kind: 'shirt', colour: '#1d1d20', note: 'Button-up · cotton poplin' },
  { name: 'Denim shirt',    group: 'Shirts',   kind: 'shirt', colour: '#6f8fb4', note: 'Western pockets · washed denim', denim: true },

  { name: 'Turtleneck',     group: 'Knits & sweats', kind: 'turtleneck', colour: '#23252b', note: 'Fine rib knit · roll neck' },
  { name: 'Hoodie',         group: 'Knits & sweats', kind: 'hoodie',     colour: '#a9abae', note: 'Heather grey · kangaroo pocket' },
  { name: 'Sweatshirt',     group: 'Knits & sweats', kind: 'sweatshirt', colour: '#27324a', note: 'Navy · crew neck fleece' },
  { name: 'Sweater',        group: 'Knits & sweats', kind: 'sweater',    colour: '#e2d8c3', note: 'Oatmeal · cable knit' },

  { name: 'Denim jacket',   group: 'Jackets',  kind: 'denimJacket',   colour: '#44638f', note: 'Trucker cut · copper buttons' },
  { name: 'Leather jacket', group: 'Jackets',  kind: 'leatherJacket', colour: '#19181a', note: 'Black leather · centre zip' },
  { name: 'Bomber',         group: 'Jackets',  kind: 'bomber',        colour: '#5a6040', note: 'Olive nylon · rib collar and cuffs' },
  { name: 'Coat',           group: 'Jackets',  kind: 'coat',          colour: '#b48a5c', note: 'Camel wool · notch lapels' },

  { name: 'Jeans',          group: 'Trousers', kind: 'jeans',      colour: '#35517d', note: 'Indigo denim · five pockets' },
  { name: 'Chinos',         group: 'Trousers', kind: 'chinos',     colour: '#c3ab82', note: 'Khaki cotton twill' },
  { name: 'Dress pants',    group: 'Trousers', kind: 'dressPants', colour: '#3a3b40', note: 'Charcoal wool · pressed crease' },
];
