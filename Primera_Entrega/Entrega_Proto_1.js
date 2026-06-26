let curvas = [];
let teclaT = false;
let tPresionadaAntes = false;
let mouseXant, mouseYant;
let clicPresionado = false;
let clicPresionadoAntes = false;

function setup() {
  createCanvas(800, 600);
  noStroke();
  mouseXant = 0;
  mouseYant = 0;

  let paleta = new Array(120);
  paleta[0]   = color(66, 58, 109);
  paleta[1]   = color(95, 124, 70);
  paleta[2]   = color(142, 61, 94);
  paleta[3]   = color('#b29eb7');
  paleta[4]   = color(52, 152, 219);
  paleta[5]   = color(155, 89, 182);
  paleta[6]   = color('#c8b421');
  paleta[7]   = color(255, 87, 51);
  paleta[8]   = color('#9c714d');
  paleta[9]   = color('#a997ac');
  paleta[10]  = color('#4c644c');
  paleta[11]  = color(198, 117, 110);
  paleta[12]  = color(204, 204, 206);
  paleta[13]  = color(69, 85, 58);
  paleta[14]  = color(88, 118, 94);
  paleta[15]  = color(187, 66, 27);
  paleta[16]  = color(116, 163, 149);
  paleta[17]  = color('#c79f01');
  paleta[18]  = color('#2c5554');
  paleta[19]  = color('#cb817e');
  paleta[20]  = color('#cdcfce');
  paleta[21]  = color('#b5a651');
  paleta[22]  = color('#94afa0');
  paleta[23]  = color('#756687');
  paleta[24]  = color('#b3672b');
  paleta[25]  = color(255, 204, 51);
  paleta[26]  = color('#728a92');
  paleta[27]  = color('#86742b');
  paleta[28]  = color('#673c1c');
  paleta[29]  = color('#a0bfc4');
  paleta[30]  = color('#cdcd97');
  paleta[31]  = color('#5b1c2f');
  paleta[32]  = color('#ab5917');
  paleta[33]  = color('#c4a105');
  paleta[34]  = color('#8a7463');
  paleta[35]  = color('#55488e');
  paleta[36]  = color('#c5aeba');
  paleta[37]  = color('#af2717');
  paleta[38]  = color('#a75915');
  paleta[39]  = color(96, 141, 147);
  paleta[40]  = color('#a9738a');
  paleta[41]  = color('#658351');
  paleta[42]  = color('#8a7c89');
  paleta[43]  = color('#a03b11');
  paleta[44]  = color('#cbcdb5');
  paleta[45]  = color(204, 153, 255);
  paleta[46]  = color(42, 64, 43);
  paleta[47]  = color('#82a8b3');
  paleta[48]  = color(119, 163, 146);
  paleta[49]  = color(220, 53, 69);
  paleta[50]  = color(126, 107, 147);
  paleta[51]  = color('#d58584');
  paleta[52]  = color('#88898d');
  paleta[53]  = color('#c5b4aa');
  paleta[54]  = color('#7b2c42');
  paleta[55]  = color('#846079');
  paleta[56]  = color('#39484f');
  paleta[57]  = color('#b6c256');
  paleta[58]  = color('#30422a');
  paleta[59]  = color(204, 153, 255);
  paleta[60]  = color('#b4aec8');
  paleta[61]  = color(160, 50, 35);
  paleta[62]  = color(255, 119, 0);
  paleta[63]  = color(185, 195, 198);
  paleta[64]  = color(239, 71, 111);
  paleta[65]  = color(255, 209, 102);
  paleta[66]  = color(216, 118, 218);
  paleta[67]  = color(179, 164, 160);
  paleta[68]  = color(202, 127, 124);
  paleta[69]  = color(249, 65, 68);
  paleta[70]  = color('#644133');
  paleta[71]  = color(111, 97, 149);
  paleta[72]  = color(213, 214, 216);
  paleta[73]  = color(196, 162, 16);
  paleta[74]  = color(47, 70, 84);
  paleta[75]  = color(243, 114, 44);
  paleta[76]  = color(176, 70, 17);
  paleta[77]  = color(121, 119, 95);
  paleta[78]  = color(85, 101, 67);
  paleta[79]  = color(124, 124, 100);
  paleta[80]  = color(128, 46, 80);
  paleta[81]  = color(115, 162, 144);
  paleta[82]  = color(187, 150, 121);
  paleta[83]  = color(162, 126, 122);
  paleta[84]  = color(187, 159, 181);
  paleta[85]  = color(127, 157, 184);
  paleta[86]  = color(179, 122, 19);
  paleta[87]  = color(110, 30, 16);
  paleta[88]  = color('#6c844e');
  paleta[89]  = color('#8e1f18');
  paleta[90]  = color(127, 175, 157);
  paleta[91]  = color(99, 122, 102);
  paleta[92]  = color(67, 170, 139);
  paleta[93]  = color('#6a8e9e');
  paleta[94]  = color('#b4b0c9');
  paleta[95]  = color(178, 194, 80);
  paleta[96]  = color(147, 172, 131);
  paleta[97]  = color(179, 164, 160);
  paleta[98]  = color('#786585');
  paleta[99]  = color(66, 58, 109);
  paleta[100] = color(95, 124, 70);
  paleta[102] = color(142, 61, 94);
  paleta[103] = color('#b29eb7');
  paleta[104] = color(52, 152, 219);
  paleta[105] = color(155, 89, 182);
  paleta[106] = color('#c8b421');
  paleta[107] = color(255, 87, 51);
  paleta[108] = color('#9c714d');
  paleta[109] = color('#a997ac');
  paleta[110] = color('#4c644c');
  paleta[111] = color(198, 117, 110);
  paleta[112] = color(204, 204, 206);
  paleta[113] = color(69, 85, 58);
  paleta[114] = color(88, 118, 94);
  paleta[115] = color(187, 66, 27);
  paleta[116] = color('#9c714d');
  paleta[117] = color('#c8b421');
  paleta[118] = color('#c8b421');
  paleta[119] = color(66, 58, 109);

  curvas.push(new Curva(0,   paleta[0],   [799,503,799,503,705,502,634,494,630,443,718,435,813,441,799,503,705,502]));
  curvas.push(new Curva(1,   paleta[1],   [623,6,623,6,630,111,689,99,690,-9,623,6,630,111]));
  curvas.push(new Curva(2,   paleta[2],   [751,11,751,11,752,75,761,102,806,102,809,6,751,11,752,75]));
  curvas.push(new Curva(3,   paleta[3],   [795,214,795,214,745,223,759,306,806,306,795,214,745,223]));
  curvas.push(new Curva(4,   paleta[4],   [479,6,479,6,484,106,420,106,419,-9,479,6,484,106]));
  curvas.push(new Curva(5,   paleta[5],   [265,101,265,101,322,102,316,230,294,248,265,230,265,101,322,102]));
  curvas.push(new Curva(6,   paleta[6],   [326,150,326,150,309,164,314,200,341,218,470,222,475,182,463,155,326,150,309,164]));
  curvas.push(new Curva(7,   paleta[7],   [381,606,381,606,380,494,325,490,314,548,319,608,381,606,380,494]));
  curvas.push(new Curva(8,   paleta[8],   [149,487,149,487,316,482,333,501,327,523,318,540,157,539,148,523,145,504,149,487,316,482]));
  curvas.push(new Curva(9,   paleta[9],   [334,540,334,540,270,533,209,536,161,545,165,585,322,589,334,540,270,533]));
  curvas.push(new Curva(10,  paleta[10],  [426,498,426,498,480,503,473,610,432,636,426,498,480,503]));
  curvas.push(new Curva(11,  paleta[11],  [475,502,475,502,438,504,436,548,432,580,435,604,478,616,475,502,438,504]));
  curvas.push(new Curva(12,  paleta[12],  [50,482,50,482,98,490,106,606,53,603,50,482,98,490]));
  curvas.push(new Curva(13,  paleta[13],  [154,329,154,329,160,362,225,369,330,366,314,328,208,318,154,329,160,362]));
  curvas.push(new Curva(14,  paleta[14],  [154,233,154,233,309,230,317,258,319,274,294,283,202,276,152,278,154,233,309,230]));
  curvas.push(new Curva(15,  paleta[15],  [155,101,155,101,214,107,214,225,186,231,154,223,155,101,214,107]));
  curvas.push(new Curva(16,  paleta[16],  [50,107,50,107,111,102,111,0,49,-16,50,107,111,102]));
  curvas.push(new Curva(17,  paleta[17],  [476,355,476,355,474,412,329,408,330,351,476,355,474,412]));
  curvas.push(new Curva(18,  paleta[18],  [315,9,315,9,310,65,198,66,154,45,162,10,315,9,310,65]));
  curvas.push(new Curva(19,  paleta[19],  [634,357,634,357,578,365,586,458,588,483,642,484,634,357,578,365]));
  curvas.push(new Curva(20,  paleta[20],  [630,313,630,313,634,366,470,362,473,314,558,315,630,313,634,366]));
  curvas.push(new Curva(21,  paleta[21],  [160,228,160,228,167,208,160,198,155,187,158,147,163,134,166,121,166,110,136,94,122,218,160,228,167,208]));
  curvas.push(new Curva(22,  paleta[22],  [150,190,150,190,145,226,56,241,-8,235,-14,184,150,190,145,226]));
  curvas.push(new Curva(23,  paleta[23],  [158,88,158,88,155,143,137,143,74,142,-14,154,-6,92,158,88,155,143]));
  curvas.push(new Curva(24,  paleta[24],  [151,158,151,158,152,197,107,194,85,193,55,198,32,193,-11,195,-6,163,18,153,64,143,136,143,151,158,152,197]));
  curvas.push(new Curva(25,  paleta[25],  [148,161,148,161,150,185,131,191,78,188,38,183,-14,188,1,160,32,154,58,154,94,162,148,161,150,185]));
  curvas.push(new Curva(26,  paleta[26],  [639,492,639,492,628,530,482,522,497,491,543,486,639,492,628,530]));
  curvas.push(new Curva(27,  paleta[27],  [158,360,158,360,149,427,171,496,202,506,217,477,208,424,210,370,158,360,149,427]));
  curvas.push(new Curva(28,  paleta[28],  [228,487,228,487,172,489,157,454,170,448,162,410,159,361,211,371,208,433,228,487,172,489]));
  curvas.push(new Curva(29,  paleta[29],  [148,395,148,395,151,428,155,448,89,452,-6,454,-6,398,78,399,148,395,151,428]));
  curvas.push(new Curva(30,  paleta[30],  [642,-4,642,-4,638,14,626,18,578,17,534,19,507,20,482,22,491,-13,642,-4,638,14]));
  curvas.push(new Curva(31,  paleta[31],  [627,62,627,62,632,23,582,19,550,22,530,23,496,20,482,30,491,58,511,64,586,70,627,62,632,23]));
  curvas.push(new Curva(32,  paleta[32],  [690,499,690,499,723,486,752,509,745,610,683,602,690,499,723,486]));
  curvas.push(new Curva(33,  paleta[33],  [747,503,747,503,739,534,739,566,739,583,745,602,777,596,779,522,747,503,739,534]));
  curvas.push(new Curva(34,  paleta[34],  [799,483,799,483,758,483,755,502,766,577,806,557,799,483,758,483]));
  curvas.push(new Curva(35,  paleta[35],  [806,493,806,493,759,497,754,529,755,573,755,608,804,604,806,493,759,497]));
  curvas.push(new Curva(36,  paleta[36],  [690,598,690,598,698,562,699,545,699,517,693,486,665,476,643,484,627,530,640,602,690,598,698,562]));
  curvas.push(new Curva(37,  paleta[37],  [685,596,685,596,685,566,690,530,694,503,664,502,638,501,644,607,685,596,685,566]));
  curvas.push(new Curva(38,  paleta[38],  [793,394,793,394,677,396,634,407,637,447,687,449,757,447,806,440,793,394,677,396]));
  curvas.push(new Curva(39,  paleta[39],  [634,362,634,362,623,378,629,396,665,410,748,413,804,406,799,363,634,362,623,378]));
  curvas.push(new Curva(40,  paleta[40],  [801,410,801,410,740,399,684,394,644,398,649,374,699,355,807,363,801,410,740,399]));
  curvas.push(new Curva(41,  paleta[41],  [637,479,637,479,645,506,654,524,650,543,647,550,633,577,498,579,484,556,479,498,637,479,645,506]));
  curvas.push(new Curva(42,  paleta[42],  [637,541,637,541,602,541,517,541,492,546,498,584,573,582,630,586,637,541,602,541]));
  curvas.push(new Curva(43,  paleta[43],  [640,612,640,612,638,574,603,570,555,570,514,570,488,575,488,606,640,612,638,574]));
  curvas.push(new Curva(44,  paleta[44],  [638,606,638,606,637,579,615,581,573,581,526,583,494,584,502,620,638,606,637,579]));
  curvas.push(new Curva(45,  paleta[45],  [634,494,634,494,634,528,606,526,579,526,519,524,490,533,490,518,481,488,517,486,618,472,634,494,634,528]));
  curvas.push(new Curva(46,  paleta[46],  [67,447,67,447,154,447,159,457,166,470,170,488,109,496,64,498,-13,487,-14,449,67,447,154,447]));
  curvas.push(new Curva(47,  paleta[47],  [134,478,134,478,105,500,116,575,153,574,157,508,134,478,105,500]));
  curvas.push(new Curva(48,  paleta[48],  [163,492,163,492,136,501,108,502,109,536,109,576,110,602,156,606,163,492,136,501]));
  curvas.push(new Curva(49,  paleta[49],  [315,585,315,585,278,582,176,578,162,608,317,617,315,585,278,582]));
  curvas.push(new Curva(50,  paleta[50],  [50,470,50,470,57,497,58,552,55,610,-14,597,-4,492,20,467,50,470,57,497]));
  curvas.push(new Curva(51,  paleta[51],  [30,475,30,475,15,481,2,502,1,533,21,546,42,530,44,486,30,475,15,481]));
  curvas.push(new Curva(52,  paleta[52],  [43,488,43,488,10,488,-4,522,-4,609,50,617,49,582,47,538,43,488,10,488]));
  curvas.push(new Curva(53,  paleta[53],  [161,66,161,66,158,106,136,120,114,111,103,62,161,66,158,106]));
  curvas.push(new Curva(54,  paleta[54],  [100,-4,100,-4,91,28,91,54,106,92,126,94,150,95,153,73,160,58,160,-1,100,-4,91,28]));
  curvas.push(new Curva(55,  paleta[55],  [51,-18,51,-18,63,41,42,95,17,31,51,-18,63,41]));
  curvas.push(new Curva(56,  paleta[56],  [45,83,45,83,48,102,37,118,16,123,-4,111,1,45,42,46,45,83,48,102]));
  curvas.push(new Curva(57,  paleta[57],  [51,-4,51,-4,54,46,42,101,2,94,-7,45,-6,-5,51,-4,54,46]));
  curvas.push(new Curva(58,  paleta[58],  [122,238,122,238,68,232,58,250,56,315,61,356,114,350,122,238,68,232]));
  curvas.push(new Curva(59,  paleta[59],  [162,410,162,410,170,391,160,363,96,362,75,360,45,348,-11,374,-13,414,3,402,35,402,74,401,119,400,162,410,170,391]));
  curvas.push(new Curva(60,  paleta[60],  [154,226,154,226,132,219,106,231,99,255,98,288,98,309,100,362,122,368,158,358,154,226,132,219]));
  curvas.push(new Curva(61,  paleta[61],  [154,234,154,234,113,234,113,263,114,327,106,359,126,351,158,358,160,334,158,274,154,234,113,234]));
  curvas.push(new Curva(62,  paleta[62],  [29,216,29,216,51,230,55,291,54,363,-1,358,-4,244,29,216,51,230]));
  curvas.push(new Curva(63,  paleta[63],  [38,230,38,230,8,230,-11,253,-6,350,23,369,55,339,55,276,52,262,48,242,38,230,8,230]));
  curvas.push(new Curva(64,  paleta[64],  [262,367,262,367,242,351,217,361,204,394,208,460,222,496,263,487,274,426,262,367,242,351]));
  curvas.push(new Curva(65,  paleta[65],  [324,362,324,362,267,364,260,390,260,422,258,454,258,487,277,509,323,488,324,362,267,364]));
  curvas.push(new Curva(66,  paleta[66],  [530,358,530,358,502,354,481,360,478,402,489,468,496,490,519,494,539,474,530,358,502,354]));
  curvas.push(new Curva(67,  paleta[67],  [319,456,319,456,304,447,302,433,310,409,338,400,414,394,475,406,451,450,319,456,304,447]));
  curvas.push(new Curva(68,  paleta[68],  [333,411,333,411,390,407,442,404,476,406,485,424,465,451,351,453,333,442,333,411,390,407]));
  curvas.push(new Curva(69,  paleta[69],  [327,439,327,439,393,437,464,442,477,452,459,482,361,473,334,466,327,439,393,437]));
  curvas.push(new Curva(70,  paleta[70],  [474,500,474,500,494,497,502,471,485,450,446,459,425,474,420,496,439,500,454,498,474,500,494,497]));
  curvas.push(new Curva(71,  paleta[71],  [475,450,475,450,482,480,476,483,459,497,401,497,370,506,325,497,302,487,299,471,314,450,401,440,475,450,482,480]));
  curvas.push(new Curva(72,  paleta[72],  [436,509,436,509,421,514,423,560,424,612,381,606,378,609,384,560,381,510,378,491,402,485,421,487,436,509,421,514]));
  curvas.push(new Curva(73,  paleta[73],  [586,477,586,477,550,473,537,486,532,471,533,452,528,431,521,398,528,366,542,358,564,355,582,371,592,409,593,436,586,477,550,473]));
  curvas.push(new Curva(74,  paleta[74],  [560,366,560,366,534,371,534,392,539,428,543,474,543,482,566,478,587,474,587,447,580,411,581,365,560,366,534,371]));
  curvas.push(new Curva(75,  paleta[75],  [331,200,331,200,369,186,440,186,470,194,464,216,384,230,330,226,331,200,369,186]));
  curvas.push(new Curva(76,  paleta[76],  [329,200,329,200,395,206,432,206,466,202,466,242,404,254,322,246,329,200,395,206]));
  curvas.push(new Curva(77,  paleta[77],  [320,229,320,229,342,236,388,248,370,344,348,374,320,353,320,229,342,236]));
  curvas.push(new Curva(78,  paleta[78],  [420,226,420,226,395,223,381,230,372,242,362,286,365,333,378,349,400,350,432,350,442,287,439,259,420,226,395,223]));
  curvas.push(new Curva(79,  paleta[79],  [436,241,436,241,406,241,376,242,375,270,372,299,375,334,372,354,400,359,428,347,436,241,406,241]));
  curvas.push(new Curva(80,  paleta[80],  [477,226,477,226,444,229,432,238,430,280,427,302,423,326,423,358,446,362,472,358,480,322,477,226,444,229]));
  curvas.push(new Curva(81,  paleta[81],  [318,99,318,99,314,117,314,144,330,162,387,162,430,161,465,152,463,98,318,99,314,117]));
  curvas.push(new Curva(82,  paleta[82],  [163,57,163,57,146,66,153,92,181,112,296,113,329,105,335,73,311,57,226,55,163,57,146,66]));
  curvas.push(new Curva(83,  paleta[83],  [171,66,171,66,166,87,159,107,202,110,282,107,320,104,330,78,308,62,238,62,171,66,166,87]));
  curvas.push(new Curva(84,  paleta[84],  [484,59,484,59,481,31,469,0,426,-25,416,5,411,23,414,42,411,68,414,107,465,98,473,78,484,59,481,31]));
  curvas.push(new Curva(85,  paleta[85],  [425,-4,425,-4,433,37,430,67,425,106,407,126,374,122,370,105,351,46,358,-17,425,-4,433,37]));
  curvas.push(new Curva(86,  paleta[86],  [378,108,378,108,377,73,374,54,377,31,372,19,372,-16,313,-2,319,29,313,55,332,61,336,94,326,111,378,108,377,73]));
  curvas.push(new Curva(87,  paleta[87],  [356,-2,356,-2,369,19,369,46,366,90,349,94,338,94,334,58,314,51,318,22,326,-4,356,-2,369,19]));
  curvas.push(new Curva(88,  paleta[88],  [326,-7,326,-7,312,24,266,34,235,36,182,33,147,24,158,-6,326,-7,312,24]));
  curvas.push(new Curva(89,  paleta[89],  [332,-7,332,-7,335,-1,318,20,296,16,256,21,210,18,166,18,177,-14,332,-7,335,-1]));
  curvas.push(new Curva(90,  paleta[90],  [266,100,266,100,271,147,271,226,266,241,237,236,207,239,203,207,203,178,203,140,206,102,266,100,271,147]));
  curvas.push(new Curva(91,  paleta[91],  [215,116,215,116,262,119,258,175,260,226,257,241,234,242,213,241,217,218,218,190,218,174,215,116,262,119]));
  curvas.push(new Curva(92,  paleta[92],  [169,279,169,279,150,283,149,309,155,328,179,329,199,325,228,325,265,325,314,332,320,289,169,279,150,283]));
  curvas.push(new Curva(93,  paleta[93],  [160,281,160,281,163,309,163,321,221,316,294,319,326,319,327,284,295,279,203,275,160,281,163,309]));
  curvas.push(new Curva(94,  paleta[94],  [636,98,636,98,650,84,650,65,636,52,602,62,576,64,510,56,486,62,507,108,636,98]));
  curvas.push(new Curva(95,  paleta[95],  [528,114,528,114,541,98,581,98,590,137,595,178,578,234,522,223,527,167,528,114,541,98]));
  curvas.push(new Curva(96,  paleta[96],  [504,88,504,88,528,95,537,121,539,158,539,186,537,237,507,222,482,205,473,156,477,130,477,116,487,95,504,88,528,95]));
  curvas.push(new Curva(97,  paleta[97],  [529,118,529,118,534,172,533,210,534,232,529,241,498,242,481,233,477,214,470,185,475,156,490,138,490,113,529,118,534,172]));
  curvas.push(new Curva(98,  paleta[98],  [657,301,657,301,630,321,625,349,634,376,664,379,692,366,704,302,657,301,630,321]));
  curvas.push(new Curva(99,  paleta[99],  [700,351,700,351,670,351,646,362,650,346,650,325,618,302,618,229,642,232,685,236,704,284,700,351,670,351]));
  curvas.push(new Curva(100, paleta[100], [735,234,735,234,688,237,679,288,687,354,730,352,735,234,688,237]));
  curvas.push(new Curva(102, paleta[102], [642,231,642,231,652,243,650,269,637,282,614,285,573,277,518,276,483,278,475,251,488,245,517,250,583,237,614,217,642,231,652,243]));
  curvas.push(new Curva(103, paleta[103], [619,196,619,196,622,261,622,281,601,275,556,266,483,277,478,234,501,241,522,243,543,234,566,238,590,225,619,196,622,261]));
  curvas.push(new Curva(104, paleta[104], [645,101,645,101,643,178,639,234,626,242,583,240,594,194,594,160,591,111,611,106,645,101,643,178]));
  curvas.push(new Curva(105, paleta[105], [638,174,638,174,626,220,646,230,679,232,694,231,735,230,758,227,797,213,794,171,638,174,626,220]));
  curvas.push(new Curva(106, paleta[106], [698,218,698,218,701,275,698,310,694,338,694,376,758,354,760,234,698,218,701,275]));
  curvas.push(new Curva(107, paleta[107], [807,258,807,258,756,232,748,252,743,310,745,340,748,368,757,380,778,379,805,362,807,258,756,232]));
  curvas.push(new Curva(108, paleta[108], [806,240,806,240,782,238,759,235,755,268,758,309,756,354,774,358,834,351,806,240,782,238]));
  curvas.push(new Curva(109, paleta[109], [648,134,648,134,639,194,734,192,806,187,806,146,648,134,639,194]));
  curvas.push(new Curva(110, paleta[110], [633,142,633,142,621,159,639,186,734,176,718,138,633,142,621,159]));
  curvas.push(new Curva(111, paleta[111], [645,133,645,133,645,181,664,180,735,174,769,186,798,190,807,130,645,133,645,181]));
  curvas.push(new Curva(112, paleta[112], [640,102,640,102,638,130,646,145,700,150,776,150,804,150,804,121,734,94,685,98,640,102,638,130]));
  curvas.push(new Curva(113, paleta[113], [686,-7,686,-7,688,20,688,42,683,71,680,87,681,104,710,126,744,100,741,-6,686,-7,688,20]));
  curvas.push(new Curva(114, paleta[114], [698,2,698,2,698,16,696,34,691,73,687,106,706,122,739,99,750,52,747,-2,698,2,698,16]));
  curvas.push(new Curva(115, paleta[115], [779,117,779,117,786,101,792,82,797,45,785,-11,749,-6,743,10,738,42,742,94,748,116,779,117,786,101]));
  curvas.push(new Curva(116, paleta[116], [635,289,635,289,639,310,633,322,593,322,551,324,510,326,484,318,475,303,483,281,518,279,562,275,635,289,639,310]));
  curvas.push(new Curva(117, paleta[117], [700,235,700,235,681,221,652,218,639,232,700,235,681,221]));
  curvas.push(new Curva(118, paleta[118], [313,560,313,560,310,538,190,540,166,540,163,562,165,579,238,578,309,583,313,560,310,538]));
  curvas.push(new Curva(119, paleta[119], [102,604,102,604,96,569,99,525,102,506,80,504,56,515,62,621,102,604,96,569]));
}

function draw() {
  background('#4F6EA0');

  let ahora = millis();
  let vientoX = mouseX - mouseXant;
  let vientoY = mouseY - mouseYant;
  mouseXant = mouseX;
  mouseYant = mouseY;

  if (clicPresionado) {
    for (let c of curvas) {
      if (c.arrastrada) {
        c.desplazX = lerp(c.desplazX, c.desplazX + vientoX * 0.8, 0.3);
        c.desplazY = lerp(c.desplazY, c.desplazY + vientoY * 0.8, 0.3);
      }
    }
  }

  for (let c of curvas) {
    if (c.girando) {
      c.anguloActual += c.velocidadGiro;
      if (abs(c.anguloActual - c.anguloOrigen) >= TWO_PI) {
        c.anguloActual = c.anguloOrigen;
        c.girando = false;
      }
    }
    if (c.girando && (ahora - c.tiempoInicio) > 4000) {
      c.anguloActual = c.anguloOrigen;
      c.girando = false;
    }

    if (c.escalando) {
      c.escalaActual = lerp(c.escalaActual, 2.0, 0.1);
    } else if (c.escalaActual !== 1.0) {
      c.escalaActual = lerp(c.escalaActual, 1.0, 0.05);
      if (abs(c.escalaActual - 1.0) < 0.01) c.escalaActual = 1.0;
    }

    if (!c.arrastrada) {
      c.desplazX = lerp(c.desplazX, 0, 0.04);
      c.desplazY = lerp(c.desplazY, 0, 0.04);
      if (abs(c.desplazX) < 0.1) c.desplazX = 0;
      if (abs(c.desplazY) < 0.1) c.desplazY = 0;
    }

    c.dibujar();
  }
}

function mousePressed() {
  if (mouseButton === LEFT) {
    clicPresionado = true;
    if (!clicPresionadoAntes) {
      clicPresionadoAntes = true;
      mouseXant = mouseX;
      mouseYant = mouseY;
      let cantidad = floor(random(16, 26));
      let indices = [];
      let disponibles = [];
      for (let i = 0; i < curvas.length; i++) disponibles.push(i);
      cantidad = min(cantidad, disponibles.length);
      while (indices.length < cantidad) {
        let rand = disponibles[floor(random(disponibles.length))];
        if (!indices.includes(rand)) indices.push(rand);
      }
      for (let c of curvas) c.arrastrada = false;
      for (let idx of indices) curvas[idx].arrastrada = true;
    }
  }
}

function mouseReleased() {
  if (mouseButton === LEFT) {
    clicPresionado = false;
    clicPresionadoAntes = false;
    for (let c of curvas) c.arrastrada = false;
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    let cantidad = floor(random(16, 26));
    let indices = [];
    let disponibles = [];
    for (let i = 0; i < curvas.length; i++) {
      if (!curvas[i].girando) disponibles.push(i);
    }
    if (disponibles.length === 0) {
      for (let i = 0; i < curvas.length; i++) disponibles.push(i);
    }
    cantidad = min(cantidad, disponibles.length);
    while (indices.length < cantidad) {
      let rand = disponibles[floor(random(disponibles.length))];
      if (!indices.includes(rand)) indices.push(rand);
    }
    for (let idx of indices) {
      let c = curvas[idx];
      if (!c.girando) {
        c.anguloOrigen = c.anguloActual;
        let dir = random(1) > 0.5 ? 1 : -1;
        c.velocidadGiro = dir * random(0.02, 0.08);
        c.girando = true;
        c.tiempoInicio = millis();
      }
    }
  }

  if (key === 't' || key === 'T') {
    teclaT = true;
    if (!tPresionadaAntes) {
      tPresionadaAntes = true;
      let cantidad = floor(random(16, 26));
      let indices = [];
      let disponibles = [];
      for (let i = 0; i < curvas.length; i++) disponibles.push(i);
      cantidad = min(cantidad, disponibles.length);
      while (indices.length < cantidad) {
        let rand = disponibles[floor(random(disponibles.length))];
        if (!indices.includes(rand)) indices.push(rand);
      }
      for (let c of curvas) c.escalando = false;
      for (let idx of indices) curvas[idx].escalando = true;
    }
  }
}

function keyReleased() {
  if (key === 't' || key === 'T') {
    teclaT = false;
    tPresionadaAntes = false;
    for (let c of curvas) c.escalando = false;
  }
}

class Curva {
  constructor(id, col, puntos) {
    this.id = id;
    this.c = col;
    this.puntos = puntos;
    this.x = 0;
    this.y = 0;
    this.anguloActual = 0;
    this.anguloOrigen = 0;
    this.velocidadGiro = 0;
    this.girando = false;
    this.tiempoInicio = 0;
    this.escalaActual = 1.0;
    this.escalando = false;
    this.desplazX = 0;
    this.desplazY = 0;
    this.arrastrada = false;
  }

  dibujar() {
    let cx = 0, cy = 0;
    let n = this.puntos.length / 2;
    for (let i = 0; i < this.puntos.length; i += 2) {
      cx += this.puntos[i] + this.x + this.desplazX;
      cy += this.puntos[i+1] + this.y + this.desplazY;
    }
    cx /= n;
    cy /= n;

    push();
    translate(cx, cy);
    rotate(this.anguloActual);
    scale(this.escalaActual);
    translate(-cx, -cy);
    fill(this.c);
    noStroke();
    beginShape();
    for (let i = 0; i < this.puntos.length; i += 2) {
      curveVertex(this.puntos[i] + this.x + this.desplazX,
                  this.puntos[i+1] + this.y + this.desplazY);
    }
    endShape(CLOSE);
    pop();
  }
}
