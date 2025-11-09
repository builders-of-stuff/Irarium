<!-- StarryNight.svelte - Reusable starry night background component -->
<div class="starry-sky absolute inset-0 h-full w-full"></div>

<style>
  @keyframes twinkle1 {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes twinkle2 {
    0%,
    100% {
      opacity: 0.4;
    }
    60% {
      opacity: 1;
    }
  }

  .starry-sky {
    background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 1) 100%
    );
  }

  .starry-sky::before,
  .starry-sky::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  /* Random scattered star field - Layer 1 */
  .starry-sky::before {
    background-image: 
      /* Bright stars - scattered randomly */
      radial-gradient(1.5px 1.5px at 23px 17px, rgba(255, 255, 255, 1), transparent),
      radial-gradient(1px 1px at 67px 43px, rgba(255, 255, 255, 0.9), transparent),
      radial-gradient(2px 2px at 8px 89px, rgba(255, 255, 255, 0.95), transparent),
      radial-gradient(1px 1px at 91px 12px, rgba(255, 255, 255, 0.85), transparent),
      radial-gradient(1.5px 1.5px at 34px 156px, rgba(255, 255, 255, 1), transparent),
      radial-gradient(1px 1px at 78px 134px, rgba(255, 255, 255, 0.8), transparent),
      radial-gradient(2px 2px at 103px 67px, rgba(255, 255, 255, 0.9), transparent),
      radial-gradient(1px 1px at 15px 201px, rgba(255, 255, 255, 0.75), transparent),
      radial-gradient(
        1.5px 1.5px at 89px 178px,
        rgba(255, 255, 255, 0.95),
        transparent
      ),
      radial-gradient(1px 1px at 52px 98px, rgba(255, 255, 255, 0.8), transparent),
      /* Medium brightness stars */
        radial-gradient(1px 1px at 41px 29px, rgba(255, 255, 255, 0.7), transparent),
      radial-gradient(0.5px 0.5px at 12px 76px, rgba(255, 255, 255, 0.65), transparent),
      radial-gradient(1px 1px at 83px 187px, rgba(255, 255, 255, 0.7), transparent),
      radial-gradient(0.5px 0.5px at 96px 45px, rgba(255, 255, 255, 0.6), transparent),
      radial-gradient(1px 1px at 19px 123px, rgba(255, 255, 255, 0.75), transparent),
      radial-gradient(
        0.5px 0.5px at 76px 209px,
        rgba(255, 255, 255, 0.65),
        transparent
      ),
      radial-gradient(1px 1px at 58px 8px, rgba(255, 255, 255, 0.7), transparent),
      radial-gradient(0.5px 0.5px at 29px 167px, rgba(255, 255, 255, 0.6), transparent),
      /* Dim stars scattered throughout */
        radial-gradient(0.5px 0.5px at 6px 54px, rgba(255, 255, 255, 0.4), transparent),
      radial-gradient(0.5px 0.5px at 37px 81px, rgba(255, 255, 255, 0.45), transparent),
      radial-gradient(0.5px 0.5px at 72px 23px, rgba(255, 255, 255, 0.35), transparent),
      radial-gradient(0.5px 0.5px at 14px 143px, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(0.5px 0.5px at 87px 106px, rgba(255, 255, 255, 0.4), transparent),
      radial-gradient(
        0.5px 0.5px at 61px 195px,
        rgba(255, 255, 255, 0.45),
        transparent
      ),
      radial-gradient(
        0.5px 0.5px at 108px 159px,
        rgba(255, 255, 255, 0.35),
        transparent
      ),
      radial-gradient(0.5px 0.5px at 45px 37px, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(0.5px 0.5px at 26px 112px, rgba(255, 255, 255, 0.4), transparent),
      radial-gradient(0.5px 0.5px at 99px 82px, rgba(255, 255, 255, 0.45), transparent);
    background-repeat: repeat;
    background-size: 120px 220px;
    animation: twinkle1 4.2s ease-in-out infinite;
  }

  /* Random scattered star field - Layer 2 */
  .starry-sky::after {
    background-image: 
      /* More bright stars with random positioning */
      radial-gradient(1.5px 1.5px at 71px 31px, rgba(255, 255, 255, 0.9), transparent),
      radial-gradient(1px 1px at 18px 58px, rgba(255, 255, 255, 0.85), transparent),
      radial-gradient(2px 2px at 94px 119px, rgba(255, 255, 255, 1), transparent),
      radial-gradient(1px 1px at 33px 186px, rgba(255, 255, 255, 0.8), transparent),
      radial-gradient(1.5px 1.5px at 107px 7px, rgba(255, 255, 255, 0.95), transparent),
      radial-gradient(1px 1px at 56px 142px, rgba(255, 255, 255, 0.75), transparent),
      radial-gradient(2px 2px at 9px 97px, rgba(255, 255, 255, 0.9), transparent),
      radial-gradient(1px 1px at 81px 163px, rgba(255, 255, 255, 0.85), transparent),
      radial-gradient(1.5px 1.5px at 47px 74px, rgba(255, 255, 255, 1), transparent),
      /* Medium stars in different positions */
        radial-gradient(1px 1px at 24px 203px, rgba(255, 255, 255, 0.7), transparent),
      radial-gradient(0.5px 0.5px at 68px 16px, rgba(255, 255, 255, 0.65), transparent),
      radial-gradient(1px 1px at 102px 131px, rgba(255, 255, 255, 0.75), transparent),
      radial-gradient(0.5px 0.5px at 11px 149px, rgba(255, 255, 255, 0.6), transparent),
      radial-gradient(1px 1px at 85px 52px, rgba(255, 255, 255, 0.7), transparent),
      radial-gradient(
        0.5px 0.5px at 39px 108px,
        rgba(255, 255, 255, 0.65),
        transparent
      ),
      radial-gradient(1px 1px at 77px 191px, rgba(255, 255, 255, 0.75), transparent),
      /* More dim stars to fill space */
        radial-gradient(
          0.5px 0.5px at 13px 25px,
          rgba(255, 255, 255, 0.35),
          transparent
        ),
      radial-gradient(0.5px 0.5px at 55px 61px, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(0.5px 0.5px at 92px 38px, rgba(255, 255, 255, 0.4), transparent),
      radial-gradient(0.5px 0.5px at 21px 87px, rgba(255, 255, 255, 0.45), transparent),
      radial-gradient(
        0.5px 0.5px at 64px 174px,
        rgba(255, 255, 255, 0.35),
        transparent
      ),
      radial-gradient(0.5px 0.5px at 98px 205px, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(0.5px 0.5px at 42px 125px, rgba(255, 255, 255, 0.4), transparent),
      radial-gradient(
        0.5px 0.5px at 16px 170px,
        rgba(255, 255, 255, 0.45),
        transparent
      ),
      radial-gradient(0.5px 0.5px at 73px 93px, rgba(255, 255, 255, 0.35), transparent),
      radial-gradient(0.5px 0.5px at 105px 46px, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(0.5px 0.5px at 28px 152px, rgba(255, 255, 255, 0.4), transparent);
    background-repeat: repeat;
    background-size: 115px 215px;
    animation: twinkle2 5.7s ease-in-out infinite 1.3s;
  }
</style>
