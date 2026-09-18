<?php
/* Template Name: הרצאה - כיבוד הורים (אסתר סולטן) */
if (!headers_sent()) {
    header('Cache-Control: no-store, no-cache, private, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('X-LiteSpeed-Cache-Control: no-cache');
}
?><!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Rubik:wght@500;700;800;900&display=swap" rel="stylesheet">
<style>
  :root{
    --purple: #450C3F;
    --purple-soft: #6d2a63;
    --olive: #B9D175;
    --olive-deep: #8fae4a;
    --mint: #D9EFBD;
    --cream: #F5FBDA;
    --ink: #2a1226;
    --paper: #fffdf6;
  }
  *{box-sizing:border-box; margin:0; padding:0;}
  html{scroll-behavior:smooth;}
  html body{
    font-family:'Heebo', sans-serif !important;
    background:var(--paper);
    color:var(--ink);
    overflow-x:hidden;
    -webkit-font-smoothing:antialiased;
  }
  html h1, html h2, html h3, html .display{
    font-family:'Rubik', sans-serif !important;
    font-weight:900;
    line-height:1.05;
  }
  img{max-width:100%; display:block;}
  a{color:inherit;}
  .wrap{max-width:1180px; margin:0 auto; padding:0 24px;}
  section{position:relative;}

  /* ---------- reveal animation engine (progressive enhancement: only animates once .js is on <html>) ---------- */
  .js .rv{
    opacity:0;
    transform:translateY(46px) scale(.92) rotate(-2deg);
    transition:opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1);
  }
  .js .rv.rv-in{opacity:1; transform:translateY(0) scale(1) rotate(0deg);}
  .js .rv-pop{transform:translateY(30px) scale(.6) rotate(6deg);}
  .js .rv-pop.rv-in{transform:translateY(0) scale(1) rotate(-2deg); transition-duration:.9s; transition-timing-function:cubic-bezier(.34,1.56,.64,1);}
  .js .rv-left{transform:translateX(-70px) rotate(-4deg); opacity:0;}
  .js .rv-left.rv-in{transform:translateX(0) rotate(0deg); opacity:1;}
  .js .rv-right{transform:translateX(70px) rotate(4deg); opacity:0;}
  .js .rv-right.rv-in{transform:translateX(0) rotate(0deg); opacity:1;}
  .js .rv-top{transform:translateY(-70px) scale(.85) rotate(-5deg); opacity:0;}
  .js .rv-top.rv-in{transform:translateY(0) scale(1) rotate(0deg); opacity:1; transition-duration:.85s; transition-timing-function:cubic-bezier(.34,1.56,.64,1);}
  .js .rv-bottom{transform:translateY(80px) scale(.85) rotate(5deg); opacity:0;}
  .js .rv-bottom.rv-in{transform:translateY(0) scale(1) rotate(0deg); opacity:1; transition-duration:.85s; transition-timing-function:cubic-bezier(.34,1.56,.64,1);}
  .d1{transition-delay:.05s} .d2{transition-delay:.15s} .d3{transition-delay:.25s}
  .d4{transition-delay:.35s} .d5{transition-delay:.45s} .d6{transition-delay:.55s}

  /* ---------- buttons ---------- */
  .btn{
    display:inline-flex; align-items:center; gap:10px;
    background:var(--olive); color:var(--purple);
    font-family:'Rubik',sans-serif; font-weight:700; font-size:19px;
    padding:18px 36px; border-radius:999px; text-decoration:none;
    box-shadow:0 8px 0 rgba(0,0,0,.25);
    transition:transform .18s ease, box-shadow .18s ease;
    border:none; cursor:pointer;
  }
  .btn:hover{transform:translateY(-3px); box-shadow:0 11px 0 rgba(0,0,0,.25);}
  .btn:active{transform:translateY(3px); box-shadow:0 4px 0 rgba(0,0,0,.25);}
  .btn svg{width:22px; height:22px; flex-shrink:0;}
  .btn-outline{background:transparent; color:var(--cream); border:2.5px solid var(--cream); box-shadow:none; padding:15px 32px;}
  .btn-outline:hover{background:var(--cream); color:var(--purple); transform:translateY(-3px);}

  /* ---------- badge ---------- */
  .badge{
    display:inline-flex; align-items:center; gap:8px;
    background:var(--olive); color:var(--purple);
    font-weight:700; font-size:14px; padding:8px 18px 8px 8px;
    border-radius:999px;
  }
  .badge .dot{width:26px;height:26px;border-radius:50%;background:var(--purple);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .badge .dot svg{width:15px;height:15px;stroke:var(--olive);}

  /* ================= HERO ================= */
  .hero{
    position:relative;
    background:linear-gradient(180deg, var(--purple) 0%, #5a1a51 100%);
    color:var(--cream);
    padding:56px 0 150px;
    overflow:hidden;
  }
  .hero .wrap{position:relative; z-index:3;}
  .hero-top{display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:56px;}
  .hero-top .bea{font-size:14px; opacity:.65; letter-spacing:.5px;}
  .eyebrow{
    font-family:'Rubik',sans-serif; font-weight:700; color:var(--olive);
    font-size:18px; margin-bottom:18px; display:block;
  }
  .hero h1{
    font-size:clamp(48px, 8vw, 104px);
    letter-spacing:-1px;
    -webkit-text-stroke:1.5px currentColor;
    text-stroke:1.5px currentColor;
  }
  .hero h1 .line{display:block; overflow:hidden;}
  .js .hero h1 .line span{display:inline-block; transform:translateY(110%); transition:transform .9s cubic-bezier(.19,1,.22,1);}
  .js .hero h1.rv-in .line span{transform:translateY(0);}
  .hero h1 .line:nth-child(2) span{transition-delay:.12s;}
  .hero h1 .big-word{color:var(--olive); font-style:normal;}
  .hero h1 .small-line{font-size:clamp(24px,4vw,46px); line-height:1.25;}

  .hero-flex{position:relative;}
  .hero-copy{padding-right:clamp(200px,26vw,340px);}
  .hero-cutout{position:absolute; right:0; bottom:0; z-index:2; width:clamp(210px,26vw,340px); line-height:0;}
  .hero-cutout img{width:100%; display:block;}
  @media(max-width:760px){
    .hero-copy{padding-right:36vw;}
    .hero-cutout{width:36vw;}
  }
  @media(max-width:480px){
    .hero-copy{padding-right:40vw;}
    .hero-cutout{width:42vw;}
  }

  .hero-sub{
    max-width:620px; font-size:20px; line-height:1.7; margin:30px 0 40px; color:#f4e9f1;
  }
  .hero-cta{display:flex; align-items:center; gap:22px; flex-wrap:wrap;}

  .hero-blobs{position:absolute; inset:0; z-index:1;}
  .blob{position:absolute; border-radius:42% 58% 63% 37% / 41% 44% 56% 59%; opacity:.5;}
  .blob1{width:340px;height:340px; background:var(--olive-deep); top:-120px; left:-90px; opacity:.35;}
  .blob2{width:220px;height:220px; background:var(--mint); bottom:-70px; right:6%; opacity:.18;}
  .blob3{width:420px;height:420px; background:var(--mint); top:8%; right:-140px; opacity:.14;}
  .hero-diag{
    position:absolute; left:0; right:0; bottom:-2px; height:150px; z-index:1; pointer-events:none;
    background:var(--paper);
    clip-path:polygon(0 42%, 100% 100%, 0 100%);
  }
  .hero-diag::before{
    content:''; position:absolute; inset:0; color:var(--purple); opacity:.06;
    background-image:
      linear-gradient(135deg, currentColor 4%, transparent 4.5%, transparent 46%, currentColor 46.5%, currentColor 50%, transparent 50.5%),
      linear-gradient(-135deg, currentColor 4%, transparent 4.5%, transparent 46%, currentColor 46.5%, currentColor 50%, transparent 50.5%);
    background-size:22px 22px;
  }
  .hero-diag2{
    position:absolute; left:0; right:0; bottom:-2px; height:90px; z-index:1; pointer-events:none;
    background:var(--olive-deep); opacity:.5;
    clip-path:polygon(0 0, 100% 100%, 0 100%);
  }


  /* ---------- reusable subtle geometric textures ---------- */
  .tex{position:absolute; inset:0; pointer-events:none; z-index:0;}
  .tex-zigzag{
    background-image:
      linear-gradient(135deg, currentColor 4%, transparent 4.5%, transparent 46%, currentColor 46.5%, currentColor 50%, transparent 50.5%),
      linear-gradient(-135deg, currentColor 4%, transparent 4.5%, transparent 46%, currentColor 46.5%, currentColor 50%, transparent 50.5%);
    background-size:22px 22px;
  }
  .tex-diag{
    background-image:repeating-linear-gradient(52deg, currentColor 0 1.5px, transparent 1.5px 20px);
  }

  /* ================= mo-hakar (recognition) ================= */
  .recognize{padding:120px 0 90px; background:var(--paper);}
  .recognize .tex{color:var(--purple); opacity:.045;}
  .recognize .eyebrow{font-size:clamp(22px,3.2vw,30px);}
  .recognize .sec-title{font-size:clamp(24px,3.6vw,38px);}
  .recognize .wrap{position:relative; z-index:1;}
  .sec-title{font-size:clamp(32px,5vw,54px); text-align:center; margin-bottom:20px;}
  .sec-title .accent{color:var(--purple);}
  .sec-lead{text-align:center; max-width:640px; margin:0 auto 70px; font-size:18px; color:#5a5a5a; line-height:1.7;}

  .recognize-body{max-width:640px; margin:0 auto; text-align:center;}
  .recognize-body p{font-size:19px; line-height:1.8; color:#3c2438; margin-bottom:18px;}
  .recognize-quote{
    max-width:640px; margin:34px auto 0; text-align:center;
    font-family:'Rubik',sans-serif; font-size:22px; color:var(--purple);
    background:var(--cream); border-radius:26px; padding:24px 30px; line-height:1.5;
  }

  /* ================= reach map ================= */
  .reach{padding:110px 0 100px; background:var(--paper); text-align:center; position:relative; overflow:hidden;}
  .reach .sec-lead{margin-bottom:10px;}
  .map-stage{position:relative; margin-top:20px;}
  .map-wrap{max-width:340px; margin:0 auto; position:relative; z-index:1;}
  .map-wrap svg{width:100%; height:auto; overflow:visible;}
  .map-outline{fill:var(--olive); fill-opacity:.5; stroke:none;}
  .map-dot{fill:var(--purple); opacity:0; transform-origin:center; transform:scale(0); transition:opacity .5s ease, transform .5s cubic-bezier(.34,1.56,.64,1);}
  .map-halo{fill:none; stroke:var(--olive-deep); stroke-width:3; opacity:0;}
  .map-hit{fill:transparent; cursor:pointer;}
  .dot-g.lit .map-dot{opacity:1; transform:scale(1);}
  .dot-g.lit .map-halo{animation:map-ping 1.8s cubic-bezier(0,.5,.5,1) infinite;}
  .dot-g:hover .map-dot{opacity:1; transform:scale(1.35);}
  @keyframes map-ping{
    0%{opacity:.6; r:5;}
    100%{opacity:0; r:22;}
  }
  .map-tip{
    position:absolute; pointer-events:none; z-index:6;
    background:var(--purple); color:var(--cream); font-family:'Rubik',sans-serif;
    font-size:12.5px; font-weight:700; padding:5px 12px; border-radius:999px;
    white-space:nowrap; opacity:0; transform:translate(-50%,-140%); transition:opacity .15s ease;
    box-shadow:0 6px 14px rgba(0,0,0,.25);
  }
  .map-tip.show{opacity:1;}

  /* word cloud: rows of institution names looping past each other for a sense of abundance,
     layered behind the map (not stacked above/below it) */
  .word-cloud{
    position:absolute; inset:0; z-index:0; overflow:hidden; direction:ltr;
    display:flex; flex-direction:column; justify-content:center; gap:22px;
    -webkit-mask-image:linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
    mask-image:linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  }
  .wc-row{display:flex; width:max-content; gap:26px; position:relative; left:0;}
  .wc-track{display:flex; align-items:baseline; gap:26px; white-space:nowrap;}
  .wc-row span{font-family:'Rubik',sans-serif; font-weight:700; color:var(--purple); white-space:nowrap;}
  .wc-a span{font-size:22px; opacity:.5;}
  .wc-b span{font-size:16px; opacity:.3;}
  .wc-c span{font-size:28px; opacity:.6;}
  .wc-d span{font-size:17px; opacity:.35;}
  .wc-e span{font-size:23px; opacity:.5;}
  .wc-row span:nth-child(3n){color:var(--olive-deep);}
  .wc-left{animation:wcLeft linear infinite;}
  .wc-right{animation:wcRight linear infinite;}
  .wc-a{animation-duration:92s;} .wc-b{animation-duration:76s;} .wc-c{animation-duration:104s;}
  .wc-d{animation-duration:80s;} .wc-e{animation-duration:96s;}
  @keyframes wcLeft{from{transform:translateX(0)} to{transform:translateX(-50%)}}
  @keyframes wcRight{from{transform:translateX(-50%)} to{transform:translateX(0)}}

  /* ================= gallery / scattered blobs ================= */
  .scatter{padding:100px 0 60px; position:relative; margin-top:-40px;}
  .scatter::before{
    content:""; position:absolute; inset:0; background:var(--mint); z-index:0;
    clip-path: polygon(0 4%, 100% 0, 100% 96%, 0 100%);
  }
  .scatter-inner{max-width:1180px; margin:0 auto; padding:60px 24px 40px; position:relative; z-index:1;}
  .photo-grid{
    display:grid; grid-template-columns:repeat(6,1fr); grid-auto-rows:80px; gap:16px;
  }
  .p-blob{
    overflow:hidden; position:relative; box-shadow:0 14px 30px rgba(69,12,63,.18);
    cursor:grab;
  }
  .p-blob:active{cursor:grabbing;}
  .p-blob img{width:100%; height:100%; object-fit:cover; transition:transform .5s ease;}
  .p-blob:hover img{transform:scale(1.08) rotate(1deg);}
  .p1{grid-column:1/4; grid-row:1/6; border-radius:58% 42% 39% 61% / 52% 40% 60% 48%; margin-top:-46px; position:relative; z-index:2;}
  .p2{grid-column:4/7; grid-row:1/4; border-radius:30% 70% 62% 38% / 46% 56% 44% 54%;}
  .p3{grid-column:4/6; grid-row:4/8; border-radius:60% 40% 45% 55% / 40% 55% 45% 60%;}
  .p4{grid-column:6/7; grid-row:4/7; border-radius:50%;}
  .p5{grid-column:1/3; grid-row:6/9; border-radius:38% 62% 55% 45% / 60% 45% 55% 40%;}
  .p6{grid-column:3/5; grid-row:8/11; border-radius:65% 35% 41% 59% / 48% 52% 48% 52%; margin-bottom:-40px; position:relative; z-index:2;}
  .p7{grid-column:5/7; grid-row:7/10; border-radius:42% 58% 60% 40% / 55% 40% 60% 45%;}
  @media(max-width:820px){
    .photo-grid{grid-template-columns:repeat(2,1fr); grid-auto-rows:120px;}
    .p1{grid-column:1/3; grid-row:1/4;}
    .p2{grid-column:1/2; grid-row:4/7;}
    .p3{grid-column:2/3; grid-row:4/7;}
    .p4{grid-column:1/2; grid-row:7/9;}
    .p5{grid-column:2/3; grid-row:7/10;}
    .p6{grid-column:1/2; grid-row:9/12;}
    .p7{grid-column:2/3; grid-row:10/13;}
  }

  /* floating quote bubbles */
  .bubble{
    position:absolute; background:var(--paper); border-radius:26px;
    padding:18px 22px; max-width:230px; font-size:14.5px; line-height:1.55;
    box-shadow:0 12px 26px rgba(69,12,63,.16);
    font-weight:500;
  }
  .bubble .who{display:block; margin-top:8px; font-size:12px; color:var(--purple-soft); font-weight:700;}
  .bubble::after{content:"”"; position:absolute; top:-6px; right:14px; font-size:46px; color:var(--olive); font-family:Georgia,serif; line-height:1;}
  .b-a{top:-52px; left:2%; transform:rotate(-6deg); z-index:2;}
  .b-b{bottom:-30px; right:-1%; transform:rotate(5deg); z-index:2;}
  .b-c{top:38%; left:-3%; transform:rotate(4deg);}
  @media(max-width:900px){.bubble{position:static; max-width:100%; margin:18px auto; transform:none !important;}}

  /* ================= about / voice section ================= */
  .about{padding:130px 0 100px; background:var(--paper); position:relative;}
  .about-grid{display:grid; grid-template-columns:1.1fr 1fr; gap:70px; align-items:center;}
  @media(max-width:860px){.about-grid{grid-template-columns:1fr;}}
  .about h2{font-size:clamp(30px,4.4vw,46px); margin-bottom:26px;}
  .about p{font-size:18px; line-height:1.85; color:#3c2438; margin-bottom:18px;}
  .about p strong{color:var(--purple);}
  .about p em{font-style:normal; color:var(--purple-soft); font-size:15.5px;}
  .about mark.highlight{
    background:linear-gradient(180deg, transparent 60%, var(--olive) 60%);
    color:var(--ink); font-weight:700; padding:0 2px; box-decoration-break:clone; -webkit-box-decoration-break:clone;
  }
  .about-photo{
    border-radius:38% 62% 55% 45% / 60% 40% 60% 40%;
    overflow:hidden; box-shadow:0 24px 50px rgba(69,12,63,.22);
  }
  .about-photo img{width:100%; aspect-ratio:4/5; object-fit:cover;}

  /* ================= versions ================= */
  .versions{padding:100px 0; background:var(--purple); color:var(--cream); position:relative; overflow:hidden;}
  .versions .wrap{position:relative; z-index:1;}
  .versions .sec-title{color:var(--cream);}
  .versions .sec-lead{color:#e8d7e4;}
  .v-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:26px; margin-top:60px;}
  @media(max-width:860px){.v-grid{grid-template-columns:1fr;}}
  .v-card{
    background:rgba(255,255,255,.06); border:1.5px solid rgba(185,209,117,.35);
    border-radius:30px; padding:34px 28px; backdrop-filter:blur(2px);
  }
  .v-card .ic{width:52px;height:52px;border-radius:50%;background:var(--olive);display:flex;align-items:center;justify-content:center;margin-bottom:20px;}
  .v-card .ic svg{width:26px;height:26px;stroke:var(--purple);}
  .v-card h3{font-family:'Rubik'; font-size:22px; margin-bottom:12px; color:var(--olive);}
  .v-card p{font-size:15.5px; line-height:1.7; color:#f0e6ee;}
  .v-card p em{font-style:normal; color:var(--olive); opacity:.85;}

  /* ================= trust bar (floats over the seam, doesn't cut the flow) ================= */
  .trust{position:relative; margin:-58px 0; z-index:5; pointer-events:none;}
  .trust-card{
    pointer-events:auto; background:var(--cream); border-radius:32px;
    padding:36px 30px; box-shadow:0 22px 46px rgba(0,0,0,.28);
    max-width:1020px; margin:0 auto;
  }
  .trust-row{display:flex; align-items:center; justify-content:center; gap:40px; flex-wrap:wrap; text-align:center;}
  .trust-item{display:flex; flex-direction:column; align-items:center; gap:8px; max-width:220px;}
  .trust-item svg{width:34px; height:34px; stroke:var(--purple);}
  .trust-item span{font-size:14px; font-weight:700; color:var(--purple);}

  /* ================= testimonials wall (chat effect) ================= */
  .wall{padding:110px 0 100px; position:relative; background:var(--purple); overflow:hidden;}
  .wall::before{
    content:""; position:absolute; inset:-40px;
    background:url('https://estersultan.com/kibud-horim/images/whatsapp-pattern.jpg') repeat; background-size:340px;
    filter:hue-rotate(140deg) saturate(1.6) brightness(.42) contrast(1.15);
    opacity:.8;
  }
  .wall::after{
    content:""; position:absolute; inset:0;
    background:linear-gradient(180deg, rgba(69,12,63,.55) 0%, rgba(69,12,63,.8) 55%, var(--purple) 100%);
  }
  .wall .wrap{position:relative; z-index:2;}
  .wall .sec-title{color:var(--cream);}
  .wall .sec-title .accent{color:var(--olive);}
  .wall .sec-lead{color:#e8d7e4;}

  .wall-masonry{columns:3 280px; column-gap:24px; max-width:1100px; margin:60px auto 0;}
  .t-bubble{
    break-inside:avoid; margin-bottom:22px; background:var(--mint);
    border-radius:22px 22px 22px 4px; padding:22px 22px 20px; position:relative;
    box-shadow:0 14px 26px rgba(0,0,0,.25);
  }
  .t-bubble:nth-child(3n+1){background:var(--cream);}
  .t-bubble:nth-child(3n+2){background:var(--mint);}
  .t-bubble:nth-child(3n){background:#fff;}
  .t-bubble:nth-child(even){border-radius:22px 22px 4px 22px;}
  .t-bubble::before{
    content:""; position:absolute; bottom:-1px; left:14px; width:18px; height:18px;
    background:inherit; clip-path:polygon(0 0, 100% 0, 0 100%);
  }
  .t-bubble:nth-child(even)::before{left:auto; right:14px; clip-path:polygon(100% 0, 0 0, 100% 100%);}
  .t-bubble p{font-size:15.5px; line-height:1.6; color:var(--ink); font-weight:500;}
  .t-bubble .who{margin-top:10px; font-size:12.5px; font-weight:700; color:var(--purple-soft);}

  /* ================= final CTA ================= */
  .final{
    padding:140px 0 120px; text-align:center; position:relative;
    background:var(--olive); color:var(--purple); overflow:hidden;
  }
  .final .wrap{position:relative; z-index:2;}
  .final h2{font-size:clamp(38px,6.5vw,70px); margin-bottom:22px;}
  .final p{font-size:19px; max-width:560px; margin:0 auto 40px; line-height:1.7; color:#3a2a17;}
  .final .btn{background:var(--purple); color:var(--olive); font-size:21px; padding:22px 46px;}
  .final .blob{background:var(--purple); opacity:.08;}
  .fb1{width:420px;height:420px; top:-160px; right:-120px;}
  .fb2{width:280px;height:280px; bottom:-140px; left:-60px;}
  .final .phone{display:block; margin-top:26px; font-size:15px; font-weight:700;}
</style>
<?php wp_head(); ?>
</head>
<body>

<!-- ================= HERO ================= -->
<section class="hero">
  <div class="hero-blobs">
    <div class="blob blob1"></div>
    <div class="blob blob2"></div>
    <div class="blob blob3"></div>
  </div>
  <div class="hero-diag2"></div>
  <div class="hero-diag"></div>

  <div class="wrap">
    <div class="hero-top rv" >
      <span class="bea">בס"ד</span>
      <span class="badge">
        <span class="dot"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
        <?php ehs_field('badge_text', 'מספר בגפ״ן 41363'); ?>
      </span>
    </div>

    <div class="hero-flex">
      <div class="hero-copy">
        <span class="eyebrow rv d1"><?php ehs_field('hero_eyebrow', 'הרצאה לאולפנות, מדרשות וערבי נשים · אסתר סולטן'); ?></span>

        <h1 class="rv">
          <span class="line"><span><?php ehs_field('hero_title_1', 'להתחבר לשורשים:'); ?></span></span>
          <span class="line"><span class="big-word small-line"><?php ehs_field('hero_title_2', 'איך לשפר את הקשר עם ההורים'); ?></span></span>
        </h1>

        <p class="hero-sub rv d2">
          <?php ehs_field('hero_subtitle', 'שיחה שמחדשת, ונוגעת בקשר הכי משמעותי בחיים שלנו — הקשר עם ההורים. שיחה בגובה העיניים, מלאה בהומור וסיפורים, ובעיקר — נותנת כלים תכל\'סיים שאפשר ליישם כבר בסוף השיחה, כדי שהקשר עם ההורים יהיה טוב ונעים יותר.'); ?>
        </p>

        <div class="hero-cta rv d3">
          <a class="btn" href="<?php echo esc_url( ehs_wa_link() ); ?>" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            <?php ehs_field('whatsapp_button_label', 'לתיאום בוואטסאפ'); ?>
          </a>
          <a class="btn btn-outline" href="#about"><?php ehs_field('cta_secondary_label', 'מה בעצם קורה בהרצאה?'); ?></a>
        </div>
      </div>
    </div>
  </div>

  <div class="hero-cutout rv rv-right d1">
    <img src="https://estersultan.com/kibud-horim/images/esther-cutout-4.png" alt="אסתר סולטן">
  </div>
</section>

<!-- ================= RECOGNITION ================= -->
<section class="recognize">
  <div class="tex tex-zigzag"></div>
  <div class="wrap">
    <span class="eyebrow rv" style="color:var(--purple); text-align:center; display:block;"><?php ehs_field('recognize_eyebrow', 'רכזת חברתית? רכזת קהילה?'); ?></span>
    <h2 class="sec-title rv d1"><?php ehs_field('recognize_question', 'נמאס לך לסגור שיחות יקרות, ולגלות ברגע האמת שהן משעממות ולא רלוונטיות לבנות?'); ?></h2>

    <div class="recognize-body rv d2">
      <?php ehs_field_html('recognize_body', '<p>שיחה שהבנות נשארות בה עד הסוף — ולא רוצות ללכת לשירותים כדי לא לפספס סיפור אמיתי.</p><p>שיחה שכבר הוכיחה את עצמה: הועברה בעשרות אולפנות, מדרשות וערבי נשים, וקיבלה תגובות מרגשות ומשמעותיות גם הרבה זמן אחרי השיחה.</p><p>נושא שלא מדברים עליו מספיק — ולא באופן מטיף. לא עוד שיעור תורני, אלא שיחה בגובה העיניים שנוגעת בלבבות.</p>'); ?>
    </div>
    <p class="recognize-quote rv d3">שיחה שיגידו לך אחריה: <b><?php ehs_field('recognize_quote', '"איזה מזל שהבאת אותה — צריך להביא אותה גם בשנה הבאה."'); ?></b></p>
  </div>
</section>

<!-- ================= PHOTO SCATTER ================= -->
<section class="scatter">
  <div class="scatter-inner">
    <h2 class="sec-title rv">איך זה נראה <span class="accent">בשטח</span></h2>
    <p class="sec-lead rv d1"><?php ehs_field('scatter_subtitle', 'אולפנות, מדרשות, ערבי נשים — מדגם לא מייצג.'); ?></p>

    <div class="photo-grid">
      <div class="p-blob p1 rv rv-top d2"><img src="https://estersultan.com/kibud-horim/images/IMG_20250610_154734.jpg" alt=""></div>
      <div class="p-blob p2 rv rv-right d1"><img src="https://estersultan.com/kibud-horim/images/IMG_20260602_151827.jpg" alt=""></div>
      <div class="p-blob p3 rv rv-left d3"><img src="https://estersultan.com/kibud-horim/images/IMG_20260128_213502.jpg" alt=""></div>
      <div class="p-blob p4 rv rv-pop d1"><img src="https://estersultan.com/kibud-horim/images/IMG_20260616_120433.jpg" alt=""></div>
      <div class="p-blob p5 rv rv-bottom d3"><img src="https://estersultan.com/kibud-horim/images/IMG_20250512_221354.jpg" alt=""></div>
      <div class="p-blob p6 rv rv-right d2"><img src="https://estersultan.com/kibud-horim/images/IMG_20260609_223827.jpg" alt=""></div>
      <div class="p-blob p7 rv rv-left d4"><img src="https://estersultan.com/kibud-horim/images/IMG_20260428_190055.jpg" alt=""></div>
    </div>

    <div class="bubble b-a rv rv-left d2">
      השיחה הייתה מרתקת! ממש הבנתי לעומק איך לכבד את ההורים שלי בצורה טובה ולא "מלמעלה".
      <span class="who">תלמידה, כיתה ז'</span>
    </div>
    <div class="bubble b-b rv rv-right d3">
      אסתר אין עליך ואין מעליך (חוץ מההורים והקב"ה) — היה וואו! מעניין, קליל ופשוט, תמיד כיף לשמוע אותך.
      <span class="who">רכזת</span>
    </div>
  </div>
</section>

<!-- ================= REACH MAP ================= -->


<!-- ================= ABOUT / VOICE ================= -->
<section class="about" id="about">
  <div class="wrap about-grid">
    <div>
      <span class="eyebrow rv">מי אני בכלל?</span>
      <p class="rv d1"><?php ehs_field_html('about_bio', 'שנים חינכתי באולפנה, ואני מכירה את שכבת הגיל הזאת ואת ההתמודדויות שלה ישר והפוך — ויודעת גם איך לדבר איתן בצורה שמתאימה להן, ולא עוברת להן מעל הראש. אני מדברת על הנושא של כיבוד הורים כבר שנים רבות, מנחה קבוצות, ואפילו יצרתי קורס דיגיטלי על זה. <em>(רוצות לשמוע עוד? יש לי גם <a href="https://www.youtube.com/@e9709684" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">פודקאסט וסרטונים ביוטיוב</a>.)</em>'); ?></p>


      <span class="eyebrow rv d1" style="margin-top:34px;">אז מה בעצם קורה שם, שעה?</span>
      <h2 class="rv d2">כולנו יודעים כמה <span style="color:var(--olive-deep)">חשוב</span> לכבד הורים.<br>בשיחה נבין למה <span style="color:var(--olive-deep)">כדאי לנו</span> לכבד את ההורים שלנו.</h2>
      <div class="rv d3"><?php ehs_field_html('about_body', '
      <p>איך הקשר הנכון איתם ישפיע לטובה על כל התחומים בחיים שלי: על הביטחון העצמי שלי, על הזוגיות, על ההורות שלי — כל אחת לפי מה שמעניין אותה.</p>
      <p>רובנו חושבים שכיבוד הורים זה מה שלמדנו בגן: לא לענות בחוצפה, לקחת סוודר כשאומרים לנו, לעזור בבית, לבוא לבקר, להביא עוגה. ואז מתוסכלים כשהקשר בכל זאת לא טוב. האמת היא שכיבוד הורים זה לא מה שאת עושה — אלא מה שאת מרגישה, מה עמדת הנפש שלך. ועל זה בדיוק אנחנו הולכים לפצח בשיחה.</p>
      <p>את הרעיונות האלה אני מביאה בקצב גבוה, עם סיפורים אמיתיים והרבה הומור — לא הרצאה חד-כיוונית אלא שיחה עם מקום לשאלות, תוך כדי ובסוף.</p>
      <p>בנות פוגשות אותי שנים אחר כך, באוטובוס, בסופר, ואומרות לי: "וואי, העברת לנו שיחה על כיבוד הורים פעם — וזה שינה לי לגמרי את החיים."</p>
      '); ?></div>
    </div>
    <div class="about-photo rv rv-pop d2">
      <img src="https://estersultan.com/kibud-horim/images/IMG_20250518_135514.jpg" alt="אסתר סולטן">
    </div>
  </div>
</section>

<!-- ================= VERSIONS ================= -->
<section class="versions">
  <div class="tex tex-diag" style="color:var(--olive); opacity:.07;"></div>
  <div class="wrap">
    <h2 class="sec-title rv">אני מתאימה את ההרצאה <span style="color:var(--olive)">לקהל שלך</span></h2>
    <p class="sec-lead rv d1">אותו רעיון מרכזי, בגרסה שמתאימה בדיוק לקבוצה שלך.</p>

    <div class="v-grid">
      <div class="v-card rv rv-pop d1">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20v-6M12 14c-3 0-5-2-5-5V4h10v5c0 3-2 5-5 5Z"/></svg></div>
        <h3><?php ehs_field('v1_title', 'חטיבה ותיכון (כיתות ו\'–י"ב)'); ?></h3>
        <p><?php ehs_field_html('v1_body', 'איך כיבוד הורים בונה את הביטחון העצמי שלי, ואיך עושים את זה בפועל <em>(מותאם לרמה של כל שכבה)</em>.'); ?></p>
      </div>
      <div class="v-card rv rv-pop d2">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/></svg></div>
        <h3><?php ehs_field('v2_title', 'שמיניסטיות'); ?></h3>
        <p><?php ehs_field('v2_body', 'חיבור לשליחות בשירות הלאומי, למפגש עם חוויות חיים מאתגרות, ולקשר עם ההורים בתקופה של השירות והמרחק מהבית.'); ?></p>
      </div>
      <div class="v-card rv rv-pop d3">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5 5 0 0 0-7.1 0L12 6.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 20.3l8.8-8.6a5 5 0 0 0 0-7.1Z"/></svg></div>
        <h3><?php ehs_field('v3_title', 'קבוצות נשים ואימהות'); ?></h3>
        <p><?php ehs_field('v3_body', 'שיחה רלוונטית לאימהות: איך הקשר עם ההורים שלך משפיע על ההורות שלך, על האימהות שלך.'); ?></p>
      </div>
    </div>
  </div>
</section>

<section class="reach">
  <div class="wrap">
    <h2 class="sec-title rv"><?php ehs_field('reach_heading', 'לאן כבר הגעתי'); ?></h2>
    <p class="sec-lead rv d1"><?php ehs_field('reach_subtitle', 'עשרות אולפנות, מדרשות וקהילות — בצפון, במרכז, בירושלים והשפלה, בשומרון ובדרום.'); ?></p>
  </div>

  <div class="map-stage">
        <div class="word-cloud rv d1">
      <div class="wc-row wc-left wc-a">
        <div class="wc-track">
          <span>אולפנת עפרה</span>
          <span>מתנ'ס שדות נגב</span>
          <span>אולפנת הגולן</span>
          <span>מועצה דתית קרני שומרון</span>
          <span>אולפנת למרחב</span>
          <span>תלמוד תורה אומץ</span>
          <span>אולפנת הרא'ה רמת גן</span>
          <span>אולפנת מבשרת ברוך</span>
          <span>אולפנת מירון</span>
          <span>שחר תרבות ורוח</span>
          <span>מדרשת מעיינותיך</span>
          <span>אולפנת בהר'ן</span>
          <span>פנים אל פנים מדרשת אריאל</span>
          <span>אולפנת בית אל</span>
          <span>אולפנת ראשית</span>
          <span>צביה רשת חינוכית</span>
          <span>אולפנת צביה שבות בית שמש</span>
          <span>אולפנת בת ים</span>
          <span>מדרשת מעלה חבר</span>
          <span>אולפנת צביה כוכב יעקב</span>
          <span>אולפנת אורות נתניה</span>
          <span>אולפנת צביה מעלה אדומים</span>
          <span>יישוב יצהר</span>
          <span>אולפנית מבשרת ברוך חדרה</span>
          <span>אולפנת אורט השחר בית שאן</span>
          <span>שיראל בית חינוך</span>
          <span>אולפנת שבות</span>
          <span>תנועת אריאל</span>
          <span>אולפנת מגדל העמק</span>
          <span>עז וענווה לישראל</span>
          <span>תנועת בני עקיבא</span>
          <span>ישיבת בית אל</span>
          <span>בית מדרש לנשים בינת הלבנה</span>
          <span>אולפנת טוהר</span>
          <span>אולפנת שעלבים</span>
          <span>חינוך תורני לבנות</span>
          <span>אולפנת בנ'ע לכיש</span>
          <span>סולמות</span>
          <span>מדרשת נשמת</span>
          <span>אולפנת רעיה</span>
          <span>משכן תחיה בית מדרש</span>
          <span>אולפנת צביה יצירתית</span>
          <span>מכללה ירושלים</span>
          <span>אולפנת בנ'ע שירת הים</span>
          <span>עמותת לביא</span>
          <span>בנין שלם</span>
          <span>מתנ'ס קרית מלאכי</span>
          <span>כפר תפוח</span>
          <span>בי'ס נווה אריאל</span>
          <span>בית ספר טהר נחל שורק</span>
          <span>הגרעין התורני רמלה</span>
          <span>אולפנת קרית ארבע</span>
          <span>תיגבור קהילה תומכת נכים</span>
          <span>אולפנת הר ברכה</span>
          <span>אולפנת מעלה לבונה</span>
        </div>
        <div class="wc-track" aria-hidden="true">
          <span>אולפנת עפרה</span>
          <span>מתנ'ס שדות נגב</span>
          <span>אולפנת הגולן</span>
          <span>מועצה דתית קרני שומרון</span>
          <span>אולפנת למרחב</span>
          <span>תלמוד תורה אומץ</span>
          <span>אולפנת הרא'ה רמת גן</span>
          <span>אולפנת מבשרת ברוך</span>
          <span>אולפנת מירון</span>
          <span>שחר תרבות ורוח</span>
          <span>מדרשת מעיינותיך</span>
          <span>אולפנת בהר'ן</span>
          <span>פנים אל פנים מדרשת אריאל</span>
          <span>אולפנת בית אל</span>
          <span>אולפנת ראשית</span>
          <span>צביה רשת חינוכית</span>
          <span>אולפנת צביה שבות בית שמש</span>
          <span>אולפנת בת ים</span>
          <span>מדרשת מעלה חבר</span>
          <span>אולפנת צביה כוכב יעקב</span>
          <span>אולפנת אורות נתניה</span>
          <span>אולפנת צביה מעלה אדומים</span>
          <span>יישוב יצהר</span>
          <span>אולפנית מבשרת ברוך חדרה</span>
          <span>אולפנת אורט השחר בית שאן</span>
          <span>שיראל בית חינוך</span>
          <span>אולפנת שבות</span>
          <span>תנועת אריאל</span>
          <span>אולפנת מגדל העמק</span>
          <span>עז וענווה לישראל</span>
          <span>תנועת בני עקיבא</span>
          <span>ישיבת בית אל</span>
          <span>בית מדרש לנשים בינת הלבנה</span>
          <span>אולפנת טוהר</span>
          <span>אולפנת שעלבים</span>
          <span>חינוך תורני לבנות</span>
          <span>אולפנת בנ'ע לכיש</span>
          <span>סולמות</span>
          <span>מדרשת נשמת</span>
          <span>אולפנת רעיה</span>
          <span>משכן תחיה בית מדרש</span>
          <span>אולפנת צביה יצירתית</span>
          <span>מכללה ירושלים</span>
          <span>אולפנת בנ'ע שירת הים</span>
          <span>עמותת לביא</span>
          <span>בנין שלם</span>
          <span>מתנ'ס קרית מלאכי</span>
          <span>כפר תפוח</span>
          <span>בי'ס נווה אריאל</span>
          <span>בית ספר טהר נחל שורק</span>
          <span>הגרעין התורני רמלה</span>
          <span>אולפנת קרית ארבע</span>
          <span>תיגבור קהילה תומכת נכים</span>
          <span>אולפנת הר ברכה</span>
          <span>אולפנת מעלה לבונה</span>
        </div>
      </div>
      <div class="wc-row wc-right wc-b">
        <div class="wc-track">
          <span>אולפנת רעיה</span>
          <span>אולפנת הגולן</span>
          <span>בנין שלם</span>
          <span>משכן תחיה בית מדרש</span>
          <span>מדרשת נשמת</span>
          <span>אולפנת מירון</span>
          <span>אולפנת הר ברכה</span>
          <span>אולפנת שבות</span>
          <span>בי'ס נווה אריאל</span>
          <span>מכללה ירושלים</span>
          <span>שחר תרבות ורוח</span>
          <span>אולפנת בת ים</span>
          <span>אולפנת שעלבים</span>
          <span>פנים אל פנים מדרשת אריאל</span>
          <span>אולפנת צביה יצירתית</span>
          <span>מדרשת מעלה חבר</span>
          <span>אולפנת הרא'ה רמת גן</span>
          <span>תלמוד תורה אומץ</span>
          <span>אולפנית מבשרת ברוך חדרה</span>
          <span>אולפנת בנ'ע שירת הים</span>
          <span>אולפנת אורט השחר בית שאן</span>
          <span>אולפנת מגדל העמק</span>
          <span>אולפנת צביה שבות בית שמש</span>
          <span>אולפנת צביה מעלה אדומים</span>
          <span>בית ספר טהר נחל שורק</span>
          <span>אולפנת בית אל</span>
          <span>יישוב יצהר</span>
          <span>עז וענווה לישראל</span>
          <span>אולפנת ראשית</span>
          <span>חינוך תורני לבנות</span>
          <span>אולפנת מעלה לבונה</span>
          <span>אולפנת למרחב</span>
          <span>אולפנת קרית ארבע</span>
          <span>הגרעין התורני רמלה</span>
          <span>אולפנת בהר'ן</span>
          <span>מועצה דתית קרני שומרון</span>
          <span>אולפנת אורות נתניה</span>
          <span>תיגבור קהילה תומכת נכים</span>
          <span>אולפנת צביה כוכב יעקב</span>
          <span>סולמות</span>
          <span>מתנ'ס קרית מלאכי</span>
          <span>אולפנת טוהר</span>
          <span>כפר תפוח</span>
          <span>בית מדרש לנשים בינת הלבנה</span>
          <span>צביה רשת חינוכית</span>
          <span>עמותת לביא</span>
          <span>ישיבת בית אל</span>
          <span>אולפנת עפרה</span>
          <span>שיראל בית חינוך</span>
          <span>אולפנת בנ'ע לכיש</span>
          <span>תנועת בני עקיבא</span>
          <span>מתנ'ס שדות נגב</span>
          <span>מדרשת מעיינותיך</span>
          <span>תנועת אריאל</span>
          <span>אולפנת מבשרת ברוך</span>
        </div>
        <div class="wc-track" aria-hidden="true">
          <span>אולפנת רעיה</span>
          <span>אולפנת הגולן</span>
          <span>בנין שלם</span>
          <span>משכן תחיה בית מדרש</span>
          <span>מדרשת נשמת</span>
          <span>אולפנת מירון</span>
          <span>אולפנת הר ברכה</span>
          <span>אולפנת שבות</span>
          <span>בי'ס נווה אריאל</span>
          <span>מכללה ירושלים</span>
          <span>שחר תרבות ורוח</span>
          <span>אולפנת בת ים</span>
          <span>אולפנת שעלבים</span>
          <span>פנים אל פנים מדרשת אריאל</span>
          <span>אולפנת צביה יצירתית</span>
          <span>מדרשת מעלה חבר</span>
          <span>אולפנת הרא'ה רמת גן</span>
          <span>תלמוד תורה אומץ</span>
          <span>אולפנית מבשרת ברוך חדרה</span>
          <span>אולפנת בנ'ע שירת הים</span>
          <span>אולפנת אורט השחר בית שאן</span>
          <span>אולפנת מגדל העמק</span>
          <span>אולפנת צביה שבות בית שמש</span>
          <span>אולפנת צביה מעלה אדומים</span>
          <span>בית ספר טהר נחל שורק</span>
          <span>אולפנת בית אל</span>
          <span>יישוב יצהר</span>
          <span>עז וענווה לישראל</span>
          <span>אולפנת ראשית</span>
          <span>חינוך תורני לבנות</span>
          <span>אולפנת מעלה לבונה</span>
          <span>אולפנת למרחב</span>
          <span>אולפנת קרית ארבע</span>
          <span>הגרעין התורני רמלה</span>
          <span>אולפנת בהר'ן</span>
          <span>מועצה דתית קרני שומרון</span>
          <span>אולפנת אורות נתניה</span>
          <span>תיגבור קהילה תומכת נכים</span>
          <span>אולפנת צביה כוכב יעקב</span>
          <span>סולמות</span>
          <span>מתנ'ס קרית מלאכי</span>
          <span>אולפנת טוהר</span>
          <span>כפר תפוח</span>
          <span>בית מדרש לנשים בינת הלבנה</span>
          <span>צביה רשת חינוכית</span>
          <span>עמותת לביא</span>
          <span>ישיבת בית אל</span>
          <span>אולפנת עפרה</span>
          <span>שיראל בית חינוך</span>
          <span>אולפנת בנ'ע לכיש</span>
          <span>תנועת בני עקיבא</span>
          <span>מתנ'ס שדות נגב</span>
          <span>מדרשת מעיינותיך</span>
          <span>תנועת אריאל</span>
          <span>אולפנת מבשרת ברוך</span>
        </div>
      </div>
      <div class="wc-row wc-left wc-c">
        <div class="wc-track">
          <span>תיגבור קהילה תומכת נכים</span>
          <span>אולפנת רעיה</span>
          <span>אולפנת צביה כוכב יעקב</span>
          <span>אולפנת ראשית</span>
          <span>אולפנת הרא'ה רמת גן</span>
          <span>מדרשת מעלה חבר</span>
          <span>כפר תפוח</span>
          <span>תלמוד תורה אומץ</span>
          <span>בית ספר טהר נחל שורק</span>
          <span>סולמות</span>
          <span>מכללה ירושלים</span>
          <span>אולפנת מירון</span>
          <span>מועצה דתית קרני שומרון</span>
          <span>תנועת אריאל</span>
          <span>אולפנת מבשרת ברוך</span>
          <span>אולפנת מגדל העמק</span>
          <span>יישוב יצהר</span>
          <span>מתנ'ס קרית מלאכי</span>
          <span>אולפנת אורט השחר בית שאן</span>
          <span>אולפנת שבות</span>
          <span>אולפנת עפרה</span>
          <span>אולפנת בנ'ע לכיש</span>
          <span>אולפנת צביה יצירתית</span>
          <span>תנועת בני עקיבא</span>
          <span>אולפנת שעלבים</span>
          <span>אולפנית מבשרת ברוך חדרה</span>
          <span>בנין שלם</span>
          <span>אולפנת בית אל</span>
          <span>הגרעין התורני רמלה</span>
          <span>צביה רשת חינוכית</span>
          <span>אולפנת טוהר</span>
          <span>שיראל בית חינוך</span>
          <span>מדרשת נשמת</span>
          <span>ישיבת בית אל</span>
          <span>מדרשת מעיינותיך</span>
          <span>בי'ס נווה אריאל</span>
          <span>פנים אל פנים מדרשת אריאל</span>
          <span>עמותת לביא</span>
          <span>בית מדרש לנשים בינת הלבנה</span>
          <span>אולפנת בהר'ן</span>
          <span>אולפנת צביה שבות בית שמש</span>
          <span>אולפנת מעלה לבונה</span>
          <span>מתנ'ס שדות נגב</span>
          <span>אולפנת אורות נתניה</span>
          <span>אולפנת בת ים</span>
          <span>חינוך תורני לבנות</span>
          <span>אולפנת הר ברכה</span>
          <span>אולפנת קרית ארבע</span>
          <span>עז וענווה לישראל</span>
          <span>שחר תרבות ורוח</span>
          <span>אולפנת צביה מעלה אדומים</span>
          <span>אולפנת הגולן</span>
          <span>אולפנת למרחב</span>
          <span>משכן תחיה בית מדרש</span>
          <span>אולפנת בנ'ע שירת הים</span>
        </div>
        <div class="wc-track" aria-hidden="true">
          <span>תיגבור קהילה תומכת נכים</span>
          <span>אולפנת רעיה</span>
          <span>אולפנת צביה כוכב יעקב</span>
          <span>אולפנת ראשית</span>
          <span>אולפנת הרא'ה רמת גן</span>
          <span>מדרשת מעלה חבר</span>
          <span>כפר תפוח</span>
          <span>תלמוד תורה אומץ</span>
          <span>בית ספר טהר נחל שורק</span>
          <span>סולמות</span>
          <span>מכללה ירושלים</span>
          <span>אולפנת מירון</span>
          <span>מועצה דתית קרני שומרון</span>
          <span>תנועת אריאל</span>
          <span>אולפנת מבשרת ברוך</span>
          <span>אולפנת מגדל העמק</span>
          <span>יישוב יצהר</span>
          <span>מתנ'ס קרית מלאכי</span>
          <span>אולפנת אורט השחר בית שאן</span>
          <span>אולפנת שבות</span>
          <span>אולפנת עפרה</span>
          <span>אולפנת בנ'ע לכיש</span>
          <span>אולפנת צביה יצירתית</span>
          <span>תנועת בני עקיבא</span>
          <span>אולפנת שעלבים</span>
          <span>אולפנית מבשרת ברוך חדרה</span>
          <span>בנין שלם</span>
          <span>אולפנת בית אל</span>
          <span>הגרעין התורני רמלה</span>
          <span>צביה רשת חינוכית</span>
          <span>אולפנת טוהר</span>
          <span>שיראל בית חינוך</span>
          <span>מדרשת נשמת</span>
          <span>ישיבת בית אל</span>
          <span>מדרשת מעיינותיך</span>
          <span>בי'ס נווה אריאל</span>
          <span>פנים אל פנים מדרשת אריאל</span>
          <span>עמותת לביא</span>
          <span>בית מדרש לנשים בינת הלבנה</span>
          <span>אולפנת בהר'ן</span>
          <span>אולפנת צביה שבות בית שמש</span>
          <span>אולפנת מעלה לבונה</span>
          <span>מתנ'ס שדות נגב</span>
          <span>אולפנת אורות נתניה</span>
          <span>אולפנת בת ים</span>
          <span>חינוך תורני לבנות</span>
          <span>אולפנת הר ברכה</span>
          <span>אולפנת קרית ארבע</span>
          <span>עז וענווה לישראל</span>
          <span>שחר תרבות ורוח</span>
          <span>אולפנת צביה מעלה אדומים</span>
          <span>אולפנת הגולן</span>
          <span>אולפנת למרחב</span>
          <span>משכן תחיה בית מדרש</span>
          <span>אולפנת בנ'ע שירת הים</span>
        </div>
      </div>
      <div class="wc-row wc-right wc-d">
        <div class="wc-track">
          <span>עמותת לביא</span>
          <span>תנועת בני עקיבא</span>
          <span>מדרשת מעיינותיך</span>
          <span>יישוב יצהר</span>
          <span>הגרעין התורני רמלה</span>
          <span>אולפנת בנ'ע שירת הים</span>
          <span>אולפנת מגדל העמק</span>
          <span>מועצה דתית קרני שומרון</span>
          <span>עז וענווה לישראל</span>
          <span>אולפנת צביה מעלה אדומים</span>
          <span>תלמוד תורה אומץ</span>
          <span>אולפנת למרחב</span>
          <span>בית ספר טהר נחל שורק</span>
          <span>כפר תפוח</span>
          <span>אולפנת צביה כוכב יעקב</span>
          <span>אולפנית מבשרת ברוך חדרה</span>
          <span>מדרשת מעלה חבר</span>
          <span>אולפנת אורט השחר בית שאן</span>
          <span>אולפנת שעלבים</span>
          <span>אולפנת בהר'ן</span>
          <span>אולפנת ראשית</span>
          <span>אולפנת הר ברכה</span>
          <span>בית מדרש לנשים בינת הלבנה</span>
          <span>אולפנת הרא'ה רמת גן</span>
          <span>אולפנת צביה יצירתית</span>
          <span>אולפנת טוהר</span>
          <span>מדרשת נשמת</span>
          <span>אולפנת מעלה לבונה</span>
          <span>אולפנת שבות</span>
          <span>אולפנת קרית ארבע</span>
          <span>בנין שלם</span>
          <span>אולפנת בית אל</span>
          <span>תנועת אריאל</span>
          <span>פנים אל פנים מדרשת אריאל</span>
          <span>אולפנת עפרה</span>
          <span>אולפנת מבשרת ברוך</span>
          <span>בי'ס נווה אריאל</span>
          <span>אולפנת אורות נתניה</span>
          <span>מתנ'ס שדות נגב</span>
          <span>חינוך תורני לבנות</span>
          <span>ישיבת בית אל</span>
          <span>מתנ'ס קרית מלאכי</span>
          <span>שיראל בית חינוך</span>
          <span>אולפנת רעיה</span>
          <span>אולפנת הגולן</span>
          <span>צביה רשת חינוכית</span>
          <span>שחר תרבות ורוח</span>
          <span>תיגבור קהילה תומכת נכים</span>
          <span>סולמות</span>
          <span>אולפנת מירון</span>
          <span>אולפנת צביה שבות בית שמש</span>
          <span>מכללה ירושלים</span>
          <span>משכן תחיה בית מדרש</span>
          <span>אולפנת בת ים</span>
          <span>אולפנת בנ'ע לכיש</span>
        </div>
        <div class="wc-track" aria-hidden="true">
          <span>עמותת לביא</span>
          <span>תנועת בני עקיבא</span>
          <span>מדרשת מעיינותיך</span>
          <span>יישוב יצהר</span>
          <span>הגרעין התורני רמלה</span>
          <span>אולפנת בנ'ע שירת הים</span>
          <span>אולפנת מגדל העמק</span>
          <span>מועצה דתית קרני שומרון</span>
          <span>עז וענווה לישראל</span>
          <span>אולפנת צביה מעלה אדומים</span>
          <span>תלמוד תורה אומץ</span>
          <span>אולפנת למרחב</span>
          <span>בית ספר טהר נחל שורק</span>
          <span>כפר תפוח</span>
          <span>אולפנת צביה כוכב יעקב</span>
          <span>אולפנית מבשרת ברוך חדרה</span>
          <span>מדרשת מעלה חבר</span>
          <span>אולפנת אורט השחר בית שאן</span>
          <span>אולפנת שעלבים</span>
          <span>אולפנת בהר'ן</span>
          <span>אולפנת ראשית</span>
          <span>אולפנת הר ברכה</span>
          <span>בית מדרש לנשים בינת הלבנה</span>
          <span>אולפנת הרא'ה רמת גן</span>
          <span>אולפנת צביה יצירתית</span>
          <span>אולפנת טוהר</span>
          <span>מדרשת נשמת</span>
          <span>אולפנת מעלה לבונה</span>
          <span>אולפנת שבות</span>
          <span>אולפנת קרית ארבע</span>
          <span>בנין שלם</span>
          <span>אולפנת בית אל</span>
          <span>תנועת אריאל</span>
          <span>פנים אל פנים מדרשת אריאל</span>
          <span>אולפנת עפרה</span>
          <span>אולפנת מבשרת ברוך</span>
          <span>בי'ס נווה אריאל</span>
          <span>אולפנת אורות נתניה</span>
          <span>מתנ'ס שדות נגב</span>
          <span>חינוך תורני לבנות</span>
          <span>ישיבת בית אל</span>
          <span>מתנ'ס קרית מלאכי</span>
          <span>שיראל בית חינוך</span>
          <span>אולפנת רעיה</span>
          <span>אולפנת הגולן</span>
          <span>צביה רשת חינוכית</span>
          <span>שחר תרבות ורוח</span>
          <span>תיגבור קהילה תומכת נכים</span>
          <span>סולמות</span>
          <span>אולפנת מירון</span>
          <span>אולפנת צביה שבות בית שמש</span>
          <span>מכללה ירושלים</span>
          <span>משכן תחיה בית מדרש</span>
          <span>אולפנת בת ים</span>
          <span>אולפנת בנ'ע לכיש</span>
        </div>
      </div>
      <div class="wc-row wc-left wc-e">
        <div class="wc-track">
          <span>מועצה דתית קרני שומרון</span>
          <span>תלמוד תורה אומץ</span>
          <span>אולפנת קרית ארבע</span>
          <span>מדרשת נשמת</span>
          <span>בית מדרש לנשים בינת הלבנה</span>
          <span>יישוב יצהר</span>
          <span>שיראל בית חינוך</span>
          <span>תנועת אריאל</span>
          <span>אולפנת מירון</span>
          <span>חינוך תורני לבנות</span>
          <span>אולפנת עפרה</span>
          <span>אולפנת צביה מעלה אדומים</span>
          <span>מכללה ירושלים</span>
          <span>מתנ'ס שדות נגב</span>
          <span>אולפנת אורות נתניה</span>
          <span>אולפנת ראשית</span>
          <span>תיגבור קהילה תומכת נכים</span>
          <span>אולפנת בנ'ע לכיש</span>
          <span>עז וענווה לישראל</span>
          <span>סולמות</span>
          <span>מדרשת מעלה חבר</span>
          <span>הגרעין התורני רמלה</span>
          <span>אולפנת שבות</span>
          <span>צביה רשת חינוכית</span>
          <span>אולפנת מבשרת ברוך</span>
          <span>ישיבת בית אל</span>
          <span>בי'ס נווה אריאל</span>
          <span>אולפנת בית אל</span>
          <span>אולפנת למרחב</span>
          <span>משכן תחיה בית מדרש</span>
          <span>אולפנת הר ברכה</span>
          <span>מדרשת מעיינותיך</span>
          <span>אולפנת שעלבים</span>
          <span>תנועת בני עקיבא</span>
          <span>אולפנת צביה כוכב יעקב</span>
          <span>פנים אל פנים מדרשת אריאל</span>
          <span>אולפנת אורט השחר בית שאן</span>
          <span>אולפנית מבשרת ברוך חדרה</span>
          <span>אולפנת טוהר</span>
          <span>אולפנת בנ'ע שירת הים</span>
          <span>אולפנת צביה יצירתית</span>
          <span>אולפנת צביה שבות בית שמש</span>
          <span>שחר תרבות ורוח</span>
          <span>עמותת לביא</span>
          <span>כפר תפוח</span>
          <span>אולפנת בת ים</span>
          <span>אולפנת רעיה</span>
          <span>בית ספר טהר נחל שורק</span>
          <span>אולפנת מעלה לבונה</span>
          <span>אולפנת הגולן</span>
          <span>אולפנת הרא'ה רמת גן</span>
          <span>מתנ'ס קרית מלאכי</span>
          <span>אולפנת מגדל העמק</span>
          <span>בנין שלם</span>
          <span>אולפנת בהר'ן</span>
        </div>
        <div class="wc-track" aria-hidden="true">
          <span>מועצה דתית קרני שומרון</span>
          <span>תלמוד תורה אומץ</span>
          <span>אולפנת קרית ארבע</span>
          <span>מדרשת נשמת</span>
          <span>בית מדרש לנשים בינת הלבנה</span>
          <span>יישוב יצהר</span>
          <span>שיראל בית חינוך</span>
          <span>תנועת אריאל</span>
          <span>אולפנת מירון</span>
          <span>חינוך תורני לבנות</span>
          <span>אולפנת עפרה</span>
          <span>אולפנת צביה מעלה אדומים</span>
          <span>מכללה ירושלים</span>
          <span>מתנ'ס שדות נגב</span>
          <span>אולפנת אורות נתניה</span>
          <span>אולפנת ראשית</span>
          <span>תיגבור קהילה תומכת נכים</span>
          <span>אולפנת בנ'ע לכיש</span>
          <span>עז וענווה לישראל</span>
          <span>סולמות</span>
          <span>מדרשת מעלה חבר</span>
          <span>הגרעין התורני רמלה</span>
          <span>אולפנת שבות</span>
          <span>צביה רשת חינוכית</span>
          <span>אולפנת מבשרת ברוך</span>
          <span>ישיבת בית אל</span>
          <span>בי'ס נווה אריאל</span>
          <span>אולפנת בית אל</span>
          <span>אולפנת למרחב</span>
          <span>משכן תחיה בית מדרש</span>
          <span>אולפנת הר ברכה</span>
          <span>מדרשת מעיינותיך</span>
          <span>אולפנת שעלבים</span>
          <span>תנועת בני עקיבא</span>
          <span>אולפנת צביה כוכב יעקב</span>
          <span>פנים אל פנים מדרשת אריאל</span>
          <span>אולפנת אורט השחר בית שאן</span>
          <span>אולפנית מבשרת ברוך חדרה</span>
          <span>אולפנת טוהר</span>
          <span>אולפנת בנ'ע שירת הים</span>
          <span>אולפנת צביה יצירתית</span>
          <span>אולפנת צביה שבות בית שמש</span>
          <span>שחר תרבות ורוח</span>
          <span>עמותת לביא</span>
          <span>כפר תפוח</span>
          <span>אולפנת בת ים</span>
          <span>אולפנת רעיה</span>
          <span>בית ספר טהר נחל שורק</span>
          <span>אולפנת מעלה לבונה</span>
          <span>אולפנת הגולן</span>
          <span>אולפנת הרא'ה רמת גן</span>
          <span>מתנ'ס קרית מלאכי</span>
          <span>אולפנת מגדל העמק</span>
          <span>בנין שלם</span>
          <span>אולפנת בהר'ן</span>
        </div>
      </div>
    </div>

  <div class="map-wrap rv d2" id="map-wrap">
      <div id="map-svg-slot" aria-hidden="true"></div>
      <div class="map-tip" id="map-tip"></div>
    </div>
  </div>
</section>

<!-- ================= TESTIMONIAL WALL ================= -->
<section class="wall" id="wall">
  <div class="wrap">
    <h2 class="sec-title rv">תגובות <span class="accent">שקיבלתי</span></h2>
    <p class="sec-lead rv d1">מדגם לא מייצג של התגובות שקיבלתי — לא נגעתי.</p>

    <div class="wall-masonry">
      <div class="t-bubble rv rv-pop d1"><p>היו תגובות מדהימות על השיחה שהעברת. ברמת שיחה משנת חיים. תמשיכי להאיר ככה.</p><span class="who">מחנכת</span></div>
      <div class="t-bubble rv rv-pop d2"><p>התלמידה שלה הייתה מרותקת כל השיחה, וממש הקשיבה. איזה שיחה חזקה, זה ממש נגע בה.</p><span class="who">מחנכת, י"ב</span></div>
      <div class="t-bubble rv rv-pop d3"><p>למדתי ממש מכל השיחה, במיוחד לא להיות בעמדה שופטת — זה הבסיס לכל המורכבות איתם. לקחתי את הקטע של הסמכות: אנחנו מתחת להורים ולא מעליהם.</p><span class="who">תלמידה</span></div>
      <div class="t-bubble rv rv-pop d1"><p>אסתר אין עליך ואין מעליך (חוץ מההורים והקב"ה 😉) — היה וואו! מעניין, קליל ופשוט, תמיד כיף לשמוע אותך.</p><span class="who">רכזת</span></div>
      <div class="t-bubble rv rv-pop d2"><p>אם היית קרובה אלינו הייתי אומרת שנעשה סדרת מפגשים. אני עדיין חושבת איך אפשר לעשות את זה שוב. היה מאוד מאוד משמעותי עבורנו.</p><span class="who">מחנכת</span></div>
      <div class="t-bubble rv rv-pop d3"><p>חשוב כל כך, והבנות ספגו כל מילה. תודה מכל הלב, ואבקש את ההקלטה...</p><span class="who">רכזת</span></div>
      <div class="t-bubble rv rv-pop d1"><p>השיחה הייתה מרתקת! ממש הבנתי לעומק איך לכבד את ההורים שלי בצורה טובה ולא "מלמעלה".</p><span class="who">תלמידה, כיתה ז'</span></div>
      <div class="t-bubble rv rv-pop d2"><p>ההרצאה גרמה לשיח ער מאוד בשכבה, השיחה ממש פתחה להן את הראש לתפיסה אחרת לגמרי.</p><span class="who">מחנכת, אולפנת בהרן</span></div>
    </div>
  </div>
</section>

<!-- ================= FINAL CTA ================= -->
<section class="final">
  <div class="tex tex-zigzag" style="color:var(--purple); opacity:.06;"></div>
  <div class="blob fb1"></div>
  <div class="blob fb2"></div>
  <div class="wrap">
    <h2 class="rv"><?php ehs_field('final_heading', 'רוצה שגם הבנות שלך יגידו "וואי, איזה שיחה חזקה"?'); ?></h2>
    <a class="btn rv d2" href="<?php echo esc_url( ehs_wa_link() ); ?>" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
      <?php ehs_field('whatsapp_button_label_final', 'לדבר עם אסתר בוואטסאפ'); ?>
    </a>
    <span class="phone rv d3"><?php ehs_field('phone_display', '054-2078913'); ?></span>
  </div>
</section>

<script>
  // progressive enhancement: only hide content pending animation if JS actually runs
  document.documentElement.classList.add('js');

  const els = document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('rv-in'); io.unobserve(e.target); }
      });
    }, {threshold:0, rootMargin:'0px 0px -10% 0px'});
    els.forEach(el=>io.observe(el));
  } else {
    els.forEach(el=>el.classList.add('rv-in'));
  }

  // a fast/instant scroll (anchor jump, drag-scrollbar) can move an element straight past
  // the observer's margin before it fires - sweep once after any scroll settles as a safety net
  let sweepTimer;
  function sweepVisible(){
    const vh = window.innerHeight;
    els.forEach(el=>{
      if(el.classList.contains('rv-in')) return;
      const r = el.getBoundingClientRect();
      if(r.top < vh && r.bottom > 0) el.classList.add('rv-in');
    });
  }
  window.addEventListener('scroll', ()=>{
    clearTimeout(sweepTimer);
    sweepTimer = setTimeout(sweepVisible, 120);
  }, {passive:true});

  // hero always animates immediately
  document.querySelectorAll('.hero .rv, .hero .rv-right').forEach(el=>{
    requestAnimationFrame(()=> setTimeout(()=>el.classList.add('rv-in'), 60));
  });

  // photo blobs: drag a little and it snaps back, like chewing gum (desktop mouse only - never hijacks touch scroll)
  document.querySelectorAll('.p-blob').forEach(el=>{
    let startX=0, startY=0, dragging=false;
    const down = e=>{
      if(e.pointerType === 'touch') return;
      dragging=true;
      el.setPointerCapture(e.pointerId);
      startX=e.clientX; startY=e.clientY;
      el.style.transition='none';
    };
    const move = e=>{
      if(!dragging) return;
      const max=26;
      let dx=(e.clientX-startX)*0.45, dy=(e.clientY-startY)*0.45;
      dx=Math.max(-max,Math.min(max,dx)); dy=Math.max(-max,Math.min(max,dy));
      el.style.transform=`translate(${dx}px,${dy}px)`;
    };
    const up = ()=>{
      if(!dragging) return;
      dragging=false;
      el.style.transition='transform .7s cubic-bezier(.34,1.56,.64,1)';
      el.style.transform='translate(0,0)';
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  });

  // map dots: light up in a random-feeling stagger once the map scrolls into view
  const mapWrap = document.getElementById('map-wrap');
  const mapSlot = document.getElementById('map-svg-slot');
  if(mapWrap && mapSlot){
    fetch('<?php echo esc_url( plugins_url('map.svg', __FILE__) ); ?>')
      .then(r => r.text())
      .then(svg => { mapSlot.outerHTML = svg; initMap(); })
      .catch(() => {});
  }
  function initMap(){
    let lit = false;
    const lightUp = ()=>{
      if(lit) return;
      lit = true;
      const dots = [...mapWrap.querySelectorAll('.dot-g')];
      dots.sort(()=>Math.random()-.5);
      dots.forEach((g,i)=> setTimeout(()=> g.classList.add('lit'), i*110 + Math.random()*160));
    };
    if('IntersectionObserver' in window){
      const mio = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{ if(e.isIntersecting){ lightUp(); mio.disconnect(); } });
      }, {threshold:.3});
      mio.observe(mapWrap);
    } else { lightUp(); }

    // hover tooltip: show the place name over the dot the pointer is on
    const tip = document.getElementById('map-tip');
    mapWrap.querySelectorAll('.dot-g').forEach(g=>{
      const label = g.getAttribute('data-label');
      g.addEventListener('mouseenter', ()=>{
        const hit = g.querySelector('.map-hit');
        const r = hit.getBoundingClientRect();
        const wrapRect = mapWrap.getBoundingClientRect();
        tip.textContent = label;
        tip.style.left = (r.left + r.width/2 - wrapRect.left) + 'px';
        tip.style.top = (r.top - wrapRect.top) + 'px';
        tip.classList.add('show');
      });
      g.addEventListener('mouseleave', ()=> tip.classList.remove('show'));
    });
  }
</script>
<?php wp_footer(); ?>
</body>
</html>
