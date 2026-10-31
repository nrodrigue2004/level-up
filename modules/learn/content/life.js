/* Life Skills: the stuff nobody sat you down and taught. Money & investing, car basics, home repair, cooking, adulting.
   Money backbone: OpenStax Principles of Finance (CC BY 4.0) + IRS/SEC Investor.gov basics, rewritten plainly.
   Step-by-step, hands-on style. General education, not personal financial advice. */
(function () {
  var G = window.RH_GEN = window.RH_GEN || {};
  function r(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function calc(q, a, why, tol) { return { t: 'calc', q: q, a: a, tol: tol == null ? 0.01 : tol, why: why }; }
  function money(x) { return '$' + Math.round(x).toLocaleString('en-US'); }

  G.lifeCompound = function () {
    var p = pk([100, 200, 300, 500]), rate = pk([6, 7, 8, 10]), yrs = pk([10, 20, 30, 40]), m = rate / 100 / 12, n = yrs * 12;
    var fv = p * (Math.pow(1 + m, n) - 1) / m, put = p * n;
    return calc('You invest <b>$' + p + ' a month</b> for <b>' + yrs + ' years</b> at an average <b>' + rate + '%</b> a year. Roughly how much do YOU put in (total dollars)?', put,
      'You put in ' + p + ' × 12 × ' + yrs + ' = ' + money(put) + '. With compounding at ' + rate + '% it grows to about <b>' + money(fv) + '</b>. That gap (' + money(fv - put) + ') is money your money made. Starting 10 years earlier matters more than investing more later.', 1);
  };
  G.lifeRule72 = function () {
    var rate = pk([2, 3, 4, 6, 8, 9, 12]);
    return calc('Rule of 72: at <b>' + rate + '%</b> a year, about how many years does money take to double?', 72 / rate, '72 ÷ ' + rate + ' = ' + (72 / rate) + ' years. Works for debt too: at a 24% credit card rate, what you owe doubles in about 3 years if you pay nothing.', 0.1);
  };
  G.lifeBudget = function () {
    var take = r(18, 60) * 100, k = pk([['needs', 50], ['wants', 30], ['savings and debt payoff', 20]]);
    return calc('Take-home pay is <b>' + money(take) + '/month</b>. Using the 50/30/20 rule, how much goes to <b>' + k[0] + '</b>?', take * k[1] / 100,
      k[1] + '% of ' + money(take) + ' = ' + money(take * k[1] / 100) + '. 50% needs (rent, food, bills), 30% wants, 20% savings/debt. It\'s a starting point, not a law.', 1);
  };
  G.lifeCard = function () {
    var bal = r(10, 50) * 100, apr = pk([22, 24, 27, 29]);
    return calc('You carry a <b>' + money(bal) + '</b> credit card balance at <b>' + apr + '% APR</b>. About how much interest is charged in one month?', bal * apr / 100 / 12,
      'Monthly rate ≈ APR ÷ 12 = ' + (apr / 12).toFixed(2) + '%. ' + money(bal) + ' × ' + (apr / 1200).toFixed(4) + ' ≈ $' + (bal * apr / 1200).toFixed(2) + ' a month, about $' + Math.round(bal * apr / 100) + ' a year, for nothing. Pay the card in full every month and it costs $0.', 1);
  };
  G.lifePay = function () {
    var wage = r(14, 32), hrs = pk([32, 36, 40]);
    return calc('You make <b>$' + wage + '/hour</b>, <b>' + hrs + ' hours a week</b>. What\'s your gross pay for a year (52 weeks)?', wage * hrs * 52,
      wage + ' × ' + hrs + ' × 52 = ' + money(wage * hrs * 52) + ' before taxes. Shortcut for full time: hourly × 2,000 ≈ yearly. Take-home is usually 20–30% less after taxes and deductions.', 1);
  };
  G.lifeGas = function () {
    var miles = r(8, 40) * 10, mpg = pk([18, 22, 25, 28, 32]), price = pk([2.79, 2.99, 3.19, 3.49]);
    return calc('A <b>' + miles + '-mile</b> trip, car gets <b>' + mpg + ' mpg</b>, gas is <b>$' + price + '/gal</b>. Fuel cost in dollars?', miles / mpg * price,
      'Gallons = ' + miles + ' ÷ ' + mpg + ' = ' + (miles / mpg).toFixed(2) + '. Cost = gallons × price ≈ $' + (miles / mpg * price).toFixed(2) + '.', 0.1);
  };
  G.lifeDeduct = function () {
    var ded = pk([500, 1000, 2000]), bill = r(2, 12) * 500;
    return calc('Your car insurance deductible is <b>' + money(ded) + '</b>. A covered repair costs <b>' + money(bill) + '</b>. How much do YOU pay?', Math.min(ded, bill),
      'You pay up to the deductible, insurance pays the rest. You: ' + money(Math.min(ded, bill)) + '. Insurance: ' + money(Math.max(0, bill - ded)) + '. A higher deductible means a lower monthly premium but more out of pocket per claim.', 1);
  };

  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    group: 'Life skills',
    id: 'life',
    name: 'Life Skills',
    mark: '🧰',
    color: '#8fae5d',
    stat: 'discipline',
    blurb: 'Money, investing, car, home & kitchen.',
    intro: "The stuff nobody sat you down and taught: how to make money grow, how credit actually works, how to change a tire and check your oil, what to do when the power or water acts up, and how to cook without poisoning anyone. Step-by-step, so you can pull it up on your phone while you're actually doing it. This is general education, not personal financial advice.",
    placement: [
      { t: 'mcq', q: 'An index fund is:', opts: ['A single company\'s stock', 'A fund that holds a whole market slice (like the S&P 500)', 'A savings account', 'A type of crypto'], a: 1, why: 'It owns hundreds of companies at once. Investing is Unit 1.' },
      { t: 'mcq', q: 'Your credit score mostly depends on:', opts: ['Your income', 'Paying bills on time and how much of your credit limit you use', 'Your job title', 'Your bank balance'], a: 1, why: 'Payment history and utilization are the big two. Credit is Unit 1.' },
      { t: 'mcq', q: 'When should you check your engine oil?', opts: ['Never', 'With the engine off, on level ground', 'While driving', 'With the engine running'], a: 1, why: 'Off and level gives an accurate reading. Car basics are Unit 2.' },
      { t: 'mcq', q: 'Half your house lost power. First thing to check:', opts: ['Call the power company', 'The breaker panel for a tripped breaker', 'Replace all bulbs', 'Unplug the fridge'], a: 1, why: 'A tripped breaker is the usual cause. Home basics are Unit 3.' },
      { t: 'mcq', q: 'Chicken is safe to eat at an internal temp of:', opts: ['120°F', '145°F', '165°F', '212°F'], a: 2, why: '165°F. Kitchen basics are Unit 4.' }
    ],
    units: [
      {
        name: 'Unit 1 · Money & investing',
        tag: 'core',
        blurb: 'Budgeting, credit, debt, investing and taxes. The math that decides whether money stresses you out for life.',
        lessons: [
          {
            id: 'life-budget', title: 'Budgeting & an emergency fund', min: 7, teaser: 'Know where it goes before it\'s gone.',
            links: ['life-credit', 'life-invest', 'm-decimals'],
            cards: [
              { t: 'read', h: 'Gross vs take-home', body: '<p><b>Gross pay</b> is what you earn before anything comes out. <b>Net (take-home) pay</b> is what hits your account after federal and state income tax, Social Security and Medicare (together called <b>FICA</b>, 7.65%), and things like health insurance and 401(k). Always budget from take-home.</p>' },
              { t: 'read', h: 'The 50/30/20 starting point', body: '<ul><li><b>50% needs</b>: rent, utilities, groceries, insurance, minimum debt payments, gas.</li><li><b>30% wants</b>: eating out, subscriptions, games, gear.</li><li><b>20% future you</b>: savings, investing, extra debt payoff.</li></ul><p>Easiest way to stick to it: <b>pay yourself first</b>. Set an automatic transfer to savings the day your paycheck lands, so you never see that money.</p>', mem: '50 needs / 30 wants / 20 future. Automate the 20.' },
              { t: 'read', h: 'Emergency fund first', body: '<p>Before investing, build an <b>emergency fund</b>: start with $1,000, then work toward 3–6 months of expenses, in a <b>high-yield savings account</b> (online banks pay far more interest than a big bank\'s regular savings, and it\'s still FDIC insured).</p><p>Why first? Without it, a $900 car repair goes on a credit card at 25% interest and wipes out a year of investing gains.</p>' },
              { t: 'gen', g: 'lifeBudget' },
              { t: 'gen', g: 'lifePay' },
              { t: 'gen', g: 'lifeDeduct' }
            ]
          },
          {
            id: 'life-credit', title: 'Credit scores & debt', min: 8, teaser: 'How the score works and how to not get wrecked by interest.',
            links: ['life-budget', 'life-invest'],
            cards: [
              { t: 'read', h: 'What the score is', body: '<p>A <b>credit score</b> (FICO, 300–850) is how risky lenders think you are. It decides whether you get an apartment, a car loan, and at what interest rate. Roughly what goes into it:</p><ul><li><b>35% payment history</b>: ever late? This is the big one.</li><li><b>30% utilization</b>: how much of your limit you\'re using. Keep it under 30%, ideally under 10%.</li><li><b>15% length of history</b>: older accounts help. Don\'t close your oldest card.</li><li>10% new credit, 10% mix of credit types.</li></ul>', mem: 'Pay on time, keep balances low, keep old cards open.' },
              { t: 'read', h: 'Using a card the right way', body: '<p>Use a credit card like a debit card: only buy what you could pay for today, then <b>pay the full statement balance</b> every month (set up autopay). Do that and you pay $0 interest and build credit for free.</p><p>Pay only the <b>minimum</b> and it can take years and cost hundreds or thousands in interest. Credit card APRs are usually 20–30%.</p>' },
              { t: 'read', h: 'Paying off debt', body: '<ul><li><b>Avalanche</b>: pay minimums on everything, throw extra at the <i>highest interest rate</i> first. Saves the most money.</li><li><b>Snowball</b>: throw extra at the <i>smallest balance</i> first. Quick wins keep you motivated. Good for ADHD brains.</li></ul><p>Check your credit reports free at <b>annualcreditreport.com</b> (the official site). Freezing your credit at the three bureaus (Equifax, Experian, TransUnion) is free and blocks identity thieves from opening accounts in your name. Security+ meets real life.</p>' },
              { t: 'gen', g: 'lifeCard' },
              { t: 'mcq', q: 'You have a $1,000 limit. Best balance to keep showing for your score?', opts: ['$950', '$500', 'Under $300, ideally under $100', 'It doesn\'t matter'], a: 2, why: 'Utilization under 30% (under $300 here), and under 10% is even better.' }
            ]
          },
          {
            id: 'life-invest', title: 'How investing works', min: 9, teaser: 'Stocks, index funds, and why time beats talent.',
            links: ['life-retire', 'life-credit', 'm-exp'],
            cards: [
              { t: 'read', h: 'What you\'re actually buying', body: '<ul><li><b>Stock</b>: a tiny slice of ownership in one company. If the company grows, your slice is worth more. If it fails, you can lose it all.</li><li><b>Bond</b>: a loan you give a company or government. Lower risk, lower return.</li><li><b>Index fund / ETF</b>: one purchase that owns hundreds of companies at once. An <b>S&P 500</b> index fund owns the 500 biggest U.S. companies. Historically the U.S. market has averaged around 10% a year before inflation, but with crashes along the way.</li></ul>' },
              { t: 'read', h: 'Compounding', body: '<p><b>Compound interest</b> = earning returns on your returns. $10,000 at 8% becomes $10,800 in a year, then 8% of $10,800, and so on. After 30 years it\'s about $100,000 with no new money added.</p><p>Time is the biggest lever. $200/month from 25 to 65 at 8% ends around $700k. Start at 35 and you end around $300k. Same monthly amount.</p><p><b>Rule of 72</b>: 72 ÷ your rate ≈ years to double.</p>', mem: 'Start early. Time in the market beats timing the market.' },
              { t: 'read', h: 'The boring strategy that wins', body: '<ul><li><b>Diversify</b>: own lots of companies (index funds) so one failure doesn\'t sink you.</li><li><b>Low fees</b>: look at the <b>expense ratio</b>. Broad index funds can be under 0.10%. A 1% fee can eat about a quarter of your money over 30 years.</li><li><b>Dollar-cost averaging</b>: invest the same amount on a schedule no matter what the market does.</li><li><b>Don\'t panic sell</b>: the market has dropped 30%+ several times and recovered every time so far. Selling in a crash locks in the loss.</li></ul><p>Red flags: guaranteed returns, "get rich quick," pressure to act now, anyone DMing you about crypto. Those are scams (social engineering again).</p>' },
              { t: 'gen', g: 'lifeCompound' },
              { t: 'gen', g: 'lifeRule72' },
              { t: 'mcq', q: 'The market drops 25% in a month. With a long-term index fund plan, the textbook move is:', opts: ['Sell everything', 'Keep investing on schedule and don\'t sell', 'Move it all to one hot stock', 'Borrow money to buy crypto'], a: 1, why: 'Selling locks in the loss. Buying on schedule means you buy cheaper shares. Only invest money you won\'t need for 5+ years.' }
            ]
          },
          {
            id: 'life-retire', title: '401(k), Roth IRA & taxes', min: 8, teaser: 'Free money from your employer, and how tax brackets really work.',
            links: ['life-invest', 'life-budget'],
            cards: [
              { t: 'read', h: 'Retirement accounts', body: '<ul><li><b>401(k)</b>: through your job, taken straight from your paycheck before taxes. Many employers <b>match</b> part of what you put in (like 50% of the first 6%). That match is a 50–100% instant return. Always contribute at least enough to get the full match.</li><li><b>Roth IRA</b>: you open it yourself (Fidelity, Schwab, Vanguard). You put in money you already paid tax on, and it grows and comes out <b>tax-free</b> in retirement. Great when you\'re young and in a low tax bracket.</li></ul><p>Opening the account isn\'t enough: you have to actually pick an investment inside it (like a target-date fund or an S&P 500 index fund), or the money just sits in cash.</p>', mem: 'Get the full 401(k) match first. Then a Roth IRA. Then pick funds inside them.' },
              { t: 'read', h: 'How tax brackets actually work', body: '<p>U.S. income tax is <b>marginal</b>: each bracket\'s rate only applies to the dollars <i>inside</i> that bracket. Moving into a higher bracket only taxes the extra dollars more. A raise can never make you take home less.</p><ul><li><b>W-4</b>: form you fill out at a new job telling them how much tax to withhold.</li><li><b>W-2</b>: form your employer sends in January showing what you earned and what was withheld.</li><li>File by about <b>April 15</b>. If too much was withheld, you get a refund. Free filing: IRS Free File / Direct File where available.</li></ul>' },
              { t: 'tf', q: 'Getting a raise that bumps you into a higher tax bracket can make your take-home pay go down.', a: false, why: 'Only the dollars above the bracket line get the higher rate. Your take-home always goes up with a raise.' },
              { t: 'mcq', q: 'Your job matches 100% of your 401(k) contributions up to 4% of pay. Minimum you should put in?', opts: ['0%', '2%', '4%', '50%'], a: 2, why: 'Put in 4% to get the full 4% match. Anything less leaves free money on the table.' }
            ]
          }
        ]
      },
      {
        name: 'Unit 2 · Car basics',
        blurb: 'Pull this up roadside. Flat tire, oil, a dead battery, and what the dash lights mean.',
        lessons: [
          {
            id: 'life-tire', title: 'Change a flat tire', min: 8, teaser: 'Step by step, safely.',
            links: ['life-oil', 'life-battery'],
            cards: [
              { t: 'read', h: 'Before you touch anything', body: '<ol><li>Get <b>fully off the road</b>, on flat, solid ground. If you\'re on a highway shoulder with traffic close, call roadside assistance instead. No tire is worth getting hit.</li><li><b>Hazards on</b>, parking brake on, car in Park (or in gear for a manual).</li><li>Find the <b>spare, jack and lug wrench</b> (usually under the trunk floor). Your owner\'s manual shows the <b>jack points</b>: reinforced spots on the frame. Jacking anywhere else can crack the car or slip.</li></ol>' },
              { t: 'read', h: 'The swap', body: '<ol><li><b>Loosen the lug nuts first, while the tire is on the ground</b>, about half a turn each, counterclockwise ("lefty loosey"). If they\'re tight, stand on the wrench.</li><li>Jack the car up until the flat is about 2 inches off the ground. Never put any part of your body under the car.</li><li>Take the lug nuts off, keep them somewhere they won\'t roll. Pull the flat off.</li><li>Put the spare on, thread the nuts by hand.</li><li>Lower the car until the tire touches, then tighten the nuts in a <b>star pattern</b> (across from each other, not in a circle) so the wheel sits evenly.</li><li>Lower fully, tighten again hard.</li></ol>' },
              { t: 'read', h: 'After', body: '<p>Most spares are a small <b>"donut"</b>: drive under 50 mph and under about 50–70 miles, then get a real tire. Check the spare\'s air pressure a couple times a year (it\'s often flat when you need it).</p><p>Check your regular tire pressure monthly. The right number is on the sticker inside the driver\'s door, not the number on the tire.</p>', mem: 'Loosen on the ground → jack → swap → star pattern → lower → tighten again.' },
              { t: 'order', q: 'Put the tire change in order.', items: ['Park on flat ground, hazards and parking brake on', 'Loosen lug nuts while the tire is on the ground', 'Jack up at the frame jack point', 'Remove nuts and the flat, mount the spare', 'Hand-thread nuts, lower, tighten in a star pattern'], why: 'The key trick is loosening before jacking: with the wheel in the air, it just spins.' },
              { t: 'mcq', q: 'Why loosen the lug nuts BEFORE jacking the car up?', opts: ['It\'s faster', 'The tire on the ground keeps the wheel from spinning while you crank', 'It\'s the law', 'No reason'], a: 1, why: 'In the air, the wheel spins when you push the wrench. On the ground, friction holds it still.' }
            ]
          },
          {
            id: 'life-oil', title: 'Check & change your oil', min: 9, teaser: 'The cheapest way to make a car last.',
            links: ['life-tire', 'life-battery'],
            cards: [
              { t: 'read', h: 'Why oil matters', body: '<p>Engine oil coats the fast-moving metal parts so they don\'t grind each other apart, and carries heat away. Over time it breaks down and gets dirty. Old or low oil is how engines die. Typical change interval for modern synthetic oil: <b>5,000–10,000 miles</b>, but your owner\'s manual is the real answer.</p>' },
              { t: 'read', h: 'Check it (2 minutes)', body: '<ol><li>Park on level ground, engine off, wait 5–10 minutes so oil drains back down.</li><li>Pull the <b>dipstick</b> (usually a yellow or orange loop), wipe it clean, push it all the way back in, pull it out again.</li><li>The oil should be between the two marks (MIN/MAX or L/F). Below the low mark → add the oil type listed in your manual or on the oil cap (like 5W-30), a little at a time, through the cap on top of the engine. Not the dipstick tube.</li><li>Color: amber is fresh, dark brown/black is due. Milky/foamy can mean coolant is leaking in: see a mechanic.</li></ol>', mem: 'Engine off, level, wipe, dip, read.' },
              { t: 'read', h: 'Change it yourself', body: '<p>You need: the right oil and amount (manual), a new <b>oil filter</b>, a wrench for the drain plug, a drain pan, gloves, and ramps or jack stands.</p><ol><li>Run the engine 2–3 minutes so the oil flows easily (warm, not hot). Turn it off.</li><li>Raise the car on ramps or jack stands. <b>Never</b> work under a car held up only by a jack.</li><li>Drain pan under the <b>drain plug</b>, unscrew it, let it drain fully.</li><li>Reinstall the plug (new crush washer if your car uses one). Snug, don\'t gorilla it: stripped threads are expensive.</li><li>Remove the old filter (it\'s full of oil), rub a little new oil on the new filter\'s rubber gasket, screw it on hand-tight plus about 3/4 turn.</li><li>Fill with new oil through the top, check the dipstick, start the engine, look for leaks, check again.</li><li>Take the old oil to an auto parts store. Most recycle it free. Never dump it.</li></ol>' },
              { t: 'mcq', q: 'The oil on your dipstick is milky and light brown, like a chocolate shake. That likely means:', opts: ['Fresh oil', 'Coolant mixing into the oil. Get it checked', 'Normal for winter', 'You need a new dipstick'], a: 1, why: 'Milky oil can point to a head gasket problem letting coolant in. Don\'t keep driving on it; have a mechanic look.' },
              { t: 'tf', q: 'It\'s fine to work under a car held up by just the jack that came with it.', a: false, why: 'Car jacks are for lifting, not holding. Use ramps or jack stands rated for your car. People die from this every year.' }
            ]
          },
          {
            id: 'life-battery', title: 'Jump-start & dashboard lights', min: 7, teaser: 'Dead battery, and which lights mean "pull over now."',
            links: ['life-oil', 'sc-elec'],
            cards: [
              { t: 'read', h: 'Jump-starting', body: '<p>Red = positive (+), black = negative (−). Order matters:</p><ol><li>Both cars off. Red clamp on the <b>dead</b> battery\'s +.</li><li>Other red clamp on the <b>good</b> battery\'s +.</li><li>Black clamp on the <b>good</b> battery\'s −.</li><li>Last black clamp on <b>unpainted metal</b> on the dead car\'s engine (a bolt or bracket), away from the battery. This avoids a spark right next to the battery, which can release hydrogen gas.</li><li>Start the good car, wait a few minutes, start the dead car.</li><li>Remove in reverse order. Drive 20+ minutes to recharge.</li></ol><p>A portable <b>jump starter pack</b> (~$50–100) means you don\'t need a second car. One of the best cheap car purchases.</p>', mem: 'Red dead, red good, black good, black to bare metal.' },
              { t: 'read', h: 'Dashboard lights', body: '<ul><li><b>Red = stop soon.</b> Oil pressure (oil can), temperature (thermometer), battery/charging, brake system. Pull over safely and turn off the engine for oil or temp lights.</li><li><b>Yellow/amber = check soon.</b> Check engine (engine outline), tire pressure (horseshoe with "!"), ABS.</li><li><b>Flashing check engine</b> = serious misfire. Slow down and get it looked at right away.</li></ul><p>Auto parts stores will usually read a check-engine code for free. A $20 Bluetooth OBD-II reader lets you read it yourself on your phone.</p>' },
              { t: 'order', q: 'Order the jumper cable connections.', items: ['Red on dead battery +', 'Red on good battery +', 'Black on good battery −', 'Black on bare metal of the dead car'], why: 'Positive first, and the last connection goes to bare metal away from the battery to keep sparks away from it.' },
              { t: 'gen', g: 'lifeGas' }
            ]
          }
        ]
      },
      {
        name: 'Unit 3 · Home basics',
        blurb: 'Power out, water everywhere, holes in the wall. Fix it or know when to call someone.',
        lessons: [
          {
            id: 'life-home', title: 'Breakers, water & the toilet', min: 8, teaser: 'The three home emergencies you can handle.',
            links: ['life-wall', 'sc-elec'],
            cards: [
              { t: 'read', h: 'The breaker panel', body: '<p>The <b>breaker panel</b> (usually in a garage, utility room or hallway closet) protects each circuit. Too much current, a breaker "trips" (flips to the middle or off) to prevent a fire.</p><p>To reset: unplug what was running (space heater + microwave on one circuit is classic), find the breaker not lined up with the others, push it fully <b>OFF</b>, then back <b>ON</b>. If it trips again right away, there may be a short. Stop and call an electrician.</p><p>Bathroom/kitchen outlets with buttons are <b>GFCI</b> outlets: they cut power fast if current leaks (like into water). Press RESET.</p>' },
              { t: 'read', h: 'Water shutoffs', body: '<p>Know where these are <i>before</i> you need them:</p><ul><li><b>Under each sink and behind each toilet</b>: a small valve. Turn clockwise to shut off.</li><li><b>Main shutoff</b>: where the water line enters the house, or at the meter near the street. Shuts off everything.</li></ul><p>A burst pipe can dump hundreds of gallons an hour. Ten seconds to the right valve saves thousands.</p>', mem: 'Righty tighty: clockwise shuts water off.' },
              { t: 'read', h: 'Toilet trouble', body: '<p><b>Clogged</b>: use a flange plunger (the one with the extra rubber sleeve). Seal it over the hole, push gently first to get air out, then plunge hard 10–15 times. If it\'s about to overflow, shut off the valve behind the toilet first.</p><p><b>Running constantly</b>: lift the tank lid. Usually it\'s the <b>flapper</b> (rubber seal at the bottom) not sealing. A new one is ~$5 and takes 5 minutes, no tools. Or the float is set too high and water spills into the overflow tube: adjust it down.</p>' },
              { t: 'mcq', q: 'A breaker keeps tripping the instant you reset it, even with everything unplugged. Best move?', opts: ['Tape it ON', 'Keep resetting it', 'Leave it off and call an electrician', 'Swap in a bigger breaker'], a: 2, why: 'Instant re-trip with nothing plugged in suggests a short or wiring fault, which is a fire risk. Never force or upsize a breaker.' },
              { t: 'tf', q: 'A constantly running toilet is usually a cheap fix.', a: true, why: 'Usually a worn flapper ($5) or a float set too high. It can also waste 200 gallons a day, so it\'s worth fixing.' }
            ]
          },
          {
            id: 'life-wall', title: 'Tools, studs & patching drywall', min: 7, teaser: 'Hang a TV and fix a hole like it never happened.',
            links: ['life-home'],
            cards: [
              { t: 'read', h: 'Starter toolkit', body: '<p>Covers 90% of jobs: a cordless drill/driver, a set of bits, a hammer, tape measure, level, utility knife, adjustable wrench, pliers, a stud finder, and a multi-bit screwdriver. Buy a decent drill once; it outlasts cheap ones many times over.</p>' },
              { t: 'read', h: 'Finding studs', body: '<p>Walls are drywall over wooden or metal <b>studs</b>, usually <b>16 inches apart</b> center to center. Anything heavy (a TV, shelves) should screw into a stud. Use a stud finder, or knock: hollow sound = gap, solid = stud. Outlets are almost always mounted on the side of a stud.</p><p>No stud where you need it? Use <b>drywall anchors</b> rated for the weight. For a TV, always hit studs.</p>' },
              { t: 'read', h: 'Patching a hole', body: '<ul><li><b>Nail holes</b>: fill with spackle using a putty knife, let dry, sand lightly, paint.</li><li><b>Bigger (doorknob size)</b>: use a self-adhesive mesh patch over the hole, then spread joint compound over it in thin coats, feathering the edges wider each time. Dry, sand, repeat 2–3 times, prime, paint.</li></ul><p>Thin coats beat one thick one. Thick globs crack and show through paint.</p>', mem: 'Heavy stuff into studs (16" apart). Patches: thin coats, feather the edges.' },
              { t: 'mcq', q: 'Studs in most U.S. homes are spaced:', opts: ['6 inches apart', '16 inches apart', '36 inches apart', 'Randomly'], a: 1, why: '16 inches on center is standard (sometimes 24). Find one, and you can measure to the next.' }
            ]
          }
        ]
      },
      {
        name: 'Unit 4 · Kitchen basics',
        blurb: 'Cook real food, cheaply and safely. Pairs with the food log in Today.',
        lessons: [
          {
            id: 'life-cook', title: 'Food safety & 5 core techniques', min: 8, teaser: 'Temps that keep you out of the bathroom, and skills that unlock every recipe.',
            links: ['life-budget', 'sc-body'],
            cards: [
              { t: 'read', h: 'Safe temperatures', body: '<p>Get a $15 instant-read thermometer. Color and "looks done" lie. Safe internal temps (USDA):</p><ul><li><b>Chicken & turkey: 165°F</b></li><li><b>Ground beef/pork: 160°F</b></li><li><b>Steaks, pork chops, fish: 145°F</b> (rest steaks 3 minutes)</li></ul><p>The <b>danger zone</b> is 40–140°F, where bacteria multiply fast. Don\'t leave food out more than 2 hours (1 hour if it\'s over 90°F out, which is half the year in Louisiana). Fridge at or below 40°F.</p>', mem: 'Chicken 165, ground meat 160, steak & fish 145. Danger zone 40–140.' },
              { t: 'read', h: 'Cross-contamination', body: '<p>Raw meat juice on a cutting board, then slicing tomatoes on it = food poisoning. Use separate boards (or wash with hot soapy water in between), wash hands after touching raw meat, and don\'t rinse raw chicken in the sink (it just splashes bacteria around).</p>' },
              { t: 'read', h: 'Five techniques that unlock everything', body: '<ol><li><b>Sauté</b>: medium-high heat, a little oil, keep food moving. Onions, peppers, garlic.</li><li><b>Sear</b>: very hot pan, dry meat, don\'t touch it for a few minutes. That brown crust is flavor.</li><li><b>Roast</b>: 400–425°F oven. Veggies tossed in oil and salt on a sheet pan, 20–35 min. Lowest effort meal there is.</li><li><b>Boil/simmer</b>: rice, pasta, soups. Simmer = small bubbles, not a rolling boil.</li><li><b>Season in layers</b>: salt a little at each step, taste as you go, add acid (lemon, vinegar) at the end if it tastes flat.</li></ol><p>Louisiana bonus: a <b>roux</b> is flour cooked in fat, stirred constantly. Peanut-butter color for étouffée, dark chocolate for gumbo. Start with the "holy trinity": onion, celery, bell pepper.</p>' },
              { t: 'mcq', q: 'Chicken is safe at an internal temperature of:', opts: ['145°F', '155°F', '165°F', 'When it\'s white inside'], a: 2, why: '165°F, checked with a thermometer in the thickest part. Color alone isn\'t reliable.' },
              { t: 'tf', q: 'You should rinse raw chicken in the sink before cooking.', a: false, why: 'Rinsing sprays bacteria around your sink and counters. Cooking to 165°F kills it.' }
            ]
          }
        ]
      }
    ]
  });
})();
