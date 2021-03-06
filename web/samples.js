function load_sample(sample) {
	points = new Array();
	if (sample == 'Sample 1') {
		points = parse_test(`6
13 100
62 45
285 175
240 300
500 192
434 222`)[1];
	} else if (sample == 'Sample 2') {
		points.push(new Point(378, 167));
		points.push(new Point(358, 123));
		points.push(new Point(321, 111));
		points.push(new Point(289, 137));
		points.push(new Point(286, 179));
		points.push(new Point(306, 224));
		points.push(new Point(334, 251));
		points.push(new Point(404, 274));
		points.push(new Point(449, 260));
		points.push(new Point(484, 232));
		points.push(new Point(521, 180));
		points.push(new Point(536, 140));
		points.push(new Point(525, 90));
		points.push(new Point(486, 61));
		points.push(new Point(423, 41));
		points.push(new Point(344, 32));
		points.push(new Point(283, 39));
		points.push(new Point(226, 63));
		points.push(new Point(201, 116));
		points.push(new Point(197, 182));
		points.push(new Point(195, 257));
		points.push(new Point(210, 308));
		points.push(new Point(240, 343));

	} else if (sample == 'Sample 3') {
		points.push(new Point(377, 189));
		points.push(new Point(317, 120));
		points.push(new Point(450, 120));
		points.push(new Point(449, 265));
		points.push(new Point(310, 264));
		points.push(new Point(281, 310));
		points.push(new Point(333, 313));
		points.push(new Point(436, 319));
		points.push(new Point(507, 330));
		points.push(new Point(516, 105));
		points.push(new Point(493, 72));
		points.push(new Point(314, 59));
		points.push(new Point(259, 84));
		points.push(new Point(184, 103));
		points.push(new Point(177, 60));
		points.push(new Point(341, 3));
		points.push(new Point(320, 2));
		points.push(new Point(545, 359));
		points.push(new Point(560, 345));
		points.push(new Point(549, 133));
		points.push(new Point(613, 144));
		points.push(new Point(226, 347));
		points.push(new Point(178, 345));
	} else if (sample == 'Sample 4') {
		points = parse_test(`41
329 137
289 146
227 163
214 172
191 194
189 210
205 228
253 246
299 255
385 270
456 273
527 256
569 242
582 216
573 188
556 173
514 160
446 140
404 134
367 133
367 39
345 53
326 81
311 126
305 180
307 234
316 283
329 330
350 356
381 366
411 364
435 345
455 308
476 253
483 187
486 138
469 99
448 67
427 38
407 33
389 35`)[1];
	} else if (sample == 'Sample 5') {
		points.push(new Point(644, 225));
		points.push(new Point(569, 103));
		points.push(new Point(303, 104));
		points.push(new Point(454, 205));
		points.push(new Point(446, 323));
		points.push(new Point(699, 28));
		points.push(new Point(233, 280));
		points.push(new Point(281, 246));
		points.push(new Point(303, 180));
		points.push(new Point(481, 152));
		points.push(new Point(31, 238));
		points.push(new Point(96, 206));
		points.push(new Point(168, 171));
		points.push(new Point(245, 89));
		points.push(new Point(653, 51));
		points.push(new Point(172, 271));
		points.push(new Point(432, 1));
		points.push(new Point(171, 228));
		points.push(new Point(65, 247));
		points.push(new Point(555, 89));
		points.push(new Point(37, 332));
		points.push(new Point(29, 317));
		points.push(new Point(563, 334));
		points.push(new Point(62, 85));
		points.push(new Point(630, 106));
		points.push(new Point(121, 91));
		points.push(new Point(173, 334));
		points.push(new Point(393, 197));
		points.push(new Point(211, 296));
		points.push(new Point(732, 134));
		points.push(new Point(591, 164));
		points.push(new Point(146, 114));
		points.push(new Point(223, 18));
		points.push(new Point(118, 148));
		points.push(new Point(105, 323));
		points.push(new Point(312, 189));
		points.push(new Point(113, 37));
		points.push(new Point(480, 114));
		points.push(new Point(77, 166));
		points.push(new Point(333, 80));
		points.push(new Point(97, 272));
		points.push(new Point(90, 313));
		points.push(new Point(93, 107));
		points.push(new Point(557, 69));
		points.push(new Point(133, 317));
		points.push(new Point(475, 72));
		points.push(new Point(496, 340));
		points.push(new Point(568, 164));
		points.push(new Point(128, 20));
		points.push(new Point(464, 347));
		points.push(new Point(658, 139));
		points.push(new Point(399, 106));
		points.push(new Point(713, 191));
		points.push(new Point(276, 22));
		points.push(new Point(26, 167));
		points.push(new Point(183, 44));
		points.push(new Point(611, 213));
		points.push(new Point(330, 96));
		points.push(new Point(310, 346));
		points.push(new Point(217, 148));
		points.push(new Point(247, 14));
		points.push(new Point(397, 244));
		points.push(new Point(323, 275));
		points.push(new Point(389, 327));
		points.push(new Point(485, 177));
		points.push(new Point(498, 196));
		points.push(new Point(325, 208));
		points.push(new Point(99, 275));
		points.push(new Point(593, 161));
		points.push(new Point(745, 165));
		points.push(new Point(509, 240));
		points.push(new Point(682, 79));
		points.push(new Point(145, 88));
		points.push(new Point(193, 48));
		points.push(new Point(315, 2));
		points.push(new Point(34, 190));
		points.push(new Point(620, 142));
		points.push(new Point(740, 70));
		points.push(new Point(25, 57));
		points.push(new Point(204, 204));
		points.push(new Point(195, 112));
		points.push(new Point(699, 138));
		points.push(new Point(735, 311));
		points.push(new Point(324, 250));
		points.push(new Point(390, 77));
		points.push(new Point(210, 277));
		points.push(new Point(630, 264));
		points.push(new Point(63, 70));
		points.push(new Point(482, 276));
		points.push(new Point(708, 314));
		points.push(new Point(418, 86));
		points.push(new Point(705, 138));
		points.push(new Point(732, 83));
		points.push(new Point(571, 205));
		points.push(new Point(721, 215));
		points.push(new Point(543, 81));
		points.push(new Point(608, 205));
		points.push(new Point(261, 8));
		points.push(new Point(320, 49));
		points.push(new Point(491, 300));
	}
	write_log(sample + ' has been loaded');
	redraw_points();
}