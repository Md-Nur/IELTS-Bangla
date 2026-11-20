import React from "react";

export interface BrandLoaderProps {
  variant?: "full" | "section" | "inline";
  text?: string;
  subtext?: string;
  className?: string;
  showText?: boolean;
}

export function BrandLoader({
  variant = "full",
  text = "লোড হচ্ছে...",
  subtext,
  className = "",
  showText = true,
}: BrandLoaderProps) {
  // Inline variant: for buttons and compact widgets
  if (variant === "inline") {
    return (
      <span className={`inline-flex items-center gap-2 text-inherit ${className}`} role="status" aria-live="polite">
        <svg
          className="animate-spin h-4 w-4 shrink-0 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3.5"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        {showText && <span className="text-xs font-semibold">{text}</span>}
      </span>
    );
  }

  // Section variant: for card or dashboard data container
  if (variant === "section") {
    return (
      <div
        className={`w-full py-12 px-4 flex flex-col items-center justify-center rounded-2xl bg-white/70 border border-[#20395F]/10 backdrop-blur-xs text-center space-y-4 animate-fadeIn ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="relative flex items-center justify-center">
          {/* Subtle pulsating ring */}
          <div className="absolute w-14 h-14 rounded-full bg-[#E7F5EF] animate-ping opacity-75" />
          {/* Outer spinner ring */}
          <div className="w-12 h-12 rounded-full border-2 border-[#087653]/20 border-t-[#087653] animate-spin" />
          {/* Mini brand crest in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="248 248 758 533"
              className="h-5 w-auto"
              aria-hidden="true"
            >
              <path
                fill="#20395F"
                fillRule="evenodd"
                d="M 433,837 L 433,869 L 468,869 L 470,871 L 470,987 L 514,987 L 514,871 L 516,869 L 554,869 L 554,838 Z M 339,837 L 339,987 L 447,987 L 447,951 L 385,951 L 383,949 L 384,838 Z M 209,837 L 209,987 L 320,987 L 320,951 L 255,951 L 253,949 L 253,925 L 255,923 L 309,923 L 309,893 L 255,893 L 253,891 L 253,871 L 255,869 L 317,869 L 318,838 Z M 138,837 L 138,987 L 184,987 L 184,837 Z M 611,833 L 589,839 L 580,844 L 570,853 L 562,867 L 560,875 L 560,890 L 565,904 L 575,915 L 590,923 L 628,936 L 633,942 L 633,949 L 626,956 L 612,958 L 596,954 L 575,940 L 554,969 L 570,981 L 590,989 L 606,992 L 629,992 L 654,984 L 670,970 L 677,957 L 679,949 L 679,932 L 673,918 L 666,911 L 656,905 L 610,887 L 605,881 L 605,874 L 611,868 L 627,866 L 641,870 L 657,879 L 676,853 L 662,843 L 645,836 L 629,833 Z"
              />
              <path
                fill="#087653"
                fillRule="evenodd"
                d="M 898,911 L 882,926 L 881,930 L 938,987 L 943,987 L 957,972 L 957,969 L 901,912 Z M 1136,848 L 1134,846 L 1116,846 L 1114,844 L 1113,835 L 1110,832 L 1092,832 L 1090,834 L 1090,844 L 1088,846 L 951,846 L 949,848 L 949,867 L 951,869 L 1044,869 L 1046,871 L 1046,877 L 1043,882 L 1036,879 L 1026,879 L 1019,882 L 1013,888 L 1001,880 L 992,878 L 981,879 L 969,884 L 957,898 L 953,910 L 952,925 L 955,939 L 959,947 L 966,956 L 978,963 L 985,965 L 996,964 L 1004,952 L 1005,944 L 1001,940 L 991,940 L 982,933 L 979,926 L 979,915 L 982,907 L 988,902 L 996,902 L 1003,908 L 1004,922 L 1006,924 L 1024,925 L 1027,922 L 1027,910 L 1029,906 L 1034,903 L 1038,904 L 1042,908 L 1045,915 L 1045,984 L 1047,987 L 1071,986 L 1072,873 L 1075,869 L 1086,869 L 1090,874 L 1090,985 L 1092,987 L 1114,987 L 1117,984 L 1116,871 L 1118,869 L 1136,868 Z"
              />
            </svg>
          </div>
        </div>
        {showText && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#20395F]/80 animate-pulse">
              {text}
            </p>
            {subtext && (
              <p className="text-[11px] text-[#20395F]/60">
                {subtext}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full variant: Full page branded loading experience
  return (
    <div
      className={`min-h-[70vh] flex-1 flex flex-col items-center justify-center p-6 bg-[#F8F8F9] text-[#20395F] transition-opacity duration-300 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center max-w-sm w-full space-y-6 text-center">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 inset-x-0 mx-auto w-48 h-48 bg-gradient-to-tr from-[#087653]/15 via-[#20395F]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Logo Card with Smooth Float and Shimmer */}
        <div className="relative z-10 bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#20395F]/10 flex flex-col items-center space-y-4">
          {/* Animated Logo Container */}
          <div className="relative flex items-center justify-center p-2">
            {/* Spinning decorative orbit */}
            <div className="absolute -inset-2.5 rounded-full border-2 border-dashed border-[#087653]/30 animate-[spin_8s_linear_infinite]" />
            <div className="absolute -inset-1 rounded-full border border-[#087653]/20 animate-ping opacity-40" />

            {/* Official Brand SVG */}
            <svg
              viewBox="248 248 758 533"
              className="h-12 sm:h-14 w-auto transform transition-transform hover:scale-105"
              aria-hidden="true"
            >
              {/* Navy/Blue Path */}
              <path
                fill="#20395F"
                fillRule="evenodd"
                d="M 433,837 L 433,869 L 468,869 L 470,871 L 470,987 L 514,987 L 514,871 L 516,869 L 554,869 L 554,838 Z M 339,837 L 339,987 L 447,987 L 447,951 L 385,951 L 383,949 L 384,838 Z M 209,837 L 209,987 L 320,987 L 320,951 L 255,951 L 253,949 L 253,925 L 255,923 L 309,923 L 309,893 L 255,893 L 253,891 L 253,871 L 255,869 L 317,869 L 318,838 Z M 138,837 L 138,987 L 184,987 L 184,837 Z M 611,833 L 589,839 L 580,844 L 570,853 L 562,867 L 560,875 L 560,890 L 565,904 L 575,915 L 590,923 L 628,936 L 633,942 L 633,949 L 626,956 L 612,958 L 596,954 L 575,940 L 554,969 L 570,981 L 590,989 L 606,992 L 629,992 L 654,984 L 670,970 L 677,957 L 679,949 L 679,932 L 673,918 L 666,911 L 656,905 L 610,887 L 605,881 L 605,874 L 611,868 L 627,866 L 641,870 L 657,879 L 676,853 L 662,843 L 645,836 L 629,833 Z M 939,518 L 887,518 L 853,523 L 832,528 L 786,544 L 757,559 L 742,569 L 710,597 L 698,611 L 683,633 L 667,665 L 659,686 L 647,733 L 673,695 L 701,666 L 722,649 L 757,627 L 802,607 L 847,594 L 885,588 L 921,587 Z M 315,517 L 332,587 L 367,588 L 406,594 L 454,608 L 492,625 L 523,644 L 551,666 L 580,696 L 605,732 L 593,685 L 583,659 L 568,630 L 543,597 L 511,569 L 469,545 L 420,528 L 373,519 Z"
              />
              {/* Emerald Green Path */}
              <path
                fill="#087653"
                fillRule="evenodd"
                d="M 898,911 L 882,926 L 881,930 L 938,987 L 943,987 L 957,972 L 957,969 L 901,912 Z M 1136,848 L 1134,846 L 1116,846 L 1114,844 L 1113,835 L 1110,832 L 1092,832 L 1090,834 L 1090,844 L 1088,846 L 951,846 L 949,848 L 949,867 L 951,869 L 1044,869 L 1046,871 L 1046,877 L 1043,882 L 1036,879 L 1026,879 L 1019,882 L 1013,888 L 1001,880 L 992,878 L 981,879 L 969,884 L 957,898 L 953,910 L 952,925 L 955,939 L 959,947 L 966,956 L 978,963 L 985,965 L 996,964 L 1004,952 L 1005,944 L 1001,940 L 991,940 L 982,933 L 979,926 L 979,915 L 982,907 L 988,902 L 996,902 L 1003,908 L 1004,922 L 1006,924 L 1024,925 L 1027,922 L 1027,910 L 1029,906 L 1034,903 L 1038,904 L 1042,908 L 1045,915 L 1045,984 L 1047,987 L 1071,986 L 1072,873 L 1075,869 L 1086,869 L 1090,874 L 1090,985 L 1092,987 L 1114,987 L 1117,984 L 1116,871 L 1118,869 L 1136,868 Z M 942,860 L 930,850 L 924,848 L 911,848 L 900,853 L 889,866 L 887,864 L 887,849 L 884,846 L 874,846 L 872,844 L 871,835 L 867,832 L 847,832 L 845,834 L 845,842 L 842,846 L 722,846 L 720,851 L 720,865 L 723,869 L 790,869 L 792,871 L 764,883 L 737,898 L 724,909 L 724,913 L 731,934 L 757,945 L 777,959 L 788,972 L 795,987 L 820,987 L 823,983 L 822,875 L 826,869 L 841,869 L 844,872 L 844,985 L 846,987 L 871,987 L 872,871 L 874,869 L 887,868 L 889,870 L 888,885 L 893,896 L 898,901 L 907,906 L 925,907 L 936,902 L 943,895 L 946,889 L 947,871 Z M 758,917 L 778,905 L 793,900 L 795,902 L 795,938 L 793,940 Z M 917,866 L 924,868 L 929,874 L 928,884 L 924,888 L 918,890 L 913,889 L 906,882 L 906,875 L 908,871 Z M 994,628 L 970,623 L 936,619 L 882,619 L 839,625 L 813,632 L 783,643 L 742,664 L 702,693 L 670,726 L 655,747 L 643,769 L 679,746 L 710,731 L 747,718 L 788,709 L 829,705 L 869,706 L 906,711 L 947,721 Z M 260,628 L 306,721 L 353,710 L 384,706 L 422,705 L 463,709 L 497,716 L 537,729 L 577,748 L 609,769 L 604,758 L 590,736 L 572,714 L 542,686 L 512,665 L 464,641 L 419,627 L 365,619 L 305,620 Z M 421,323 L 458,349 L 498,386 L 531,426 L 563,477 L 586,528 L 603,580 L 618,652 L 627,732 L 628,709 L 634,659 L 651,578 L 666,531 L 693,471 L 721,427 L 753,388 L 790,353 L 832,323 L 798,329 L 764,341 L 726,360 L 664,399 L 649,406 L 633,410 L 620,410 L 601,405 L 585,397 L 519,356 L 488,341 L 450,328 Z M 623,260 L 605,264 L 592,271 L 581,281 L 569,303 L 566,325 L 571,346 L 580,361 L 588,369 L 607,380 L 630,383 L 642,381 L 655,376 L 674,360 L 682,347 L 686,335 L 687,314 L 683,299 L 678,289 L 664,273 L 642,262 Z"
              />
            </svg>
          </div>

          {/* Platform Identity */}
          <div className="font-bold tracking-tight text-lg text-[#20395F]">
            IELTS <span className="text-[#087653]">বাংলা</span>
          </div>

          {/* Subtle Progress Bar */}
          <div className="w-40 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#087653] to-[#20395F] rounded-full animate-indeterminate" />
          </div>

          {/* Bengali Loading Text */}
          {showText && (
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-[#20395F]/80">
                {text}
              </p>
              {subtext && (
                <p className="text-[11px] sm:text-xs text-[#20395F]/60">
                  {subtext}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
