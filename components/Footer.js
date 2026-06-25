'use client';

import { Globe, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  //footer links
  const footerLinks = [
    {
      title: 'Get to Know Us',
      links: ['About Us', 'Careers', 'Press Releases', 'Amazon Science'],
    },
    {
      title: 'Connect with Us',
      links: ['Facebook', 'Twitter', 'Instagram'],
    },
    {
      title: 'Make Money with Us',
      links: [
        'Sell on Amazon',
        'Sell under Amazon Accelerator',
        'Protect and Build Your Brand',
        'Amazon Global Selling',
      ],
    },
    {
      title: 'Let Us Help You',
      links: [
        'Your Account',
        'Returns Centre',
        '100% Purchase Protection',
        'Help',
      ],
    },
  ];
   //sub directories
  const subDirectories = [
    { title: 'AbeBooks', desc: 'Books, art & collectibles' },
    { title: 'Amazon Web Services', desc: 'Scalable Cloud Computing Services' },
    { title: 'Audible', desc: 'Download Audio Books' },
    { title: 'IMDb', desc: 'Movies, TV & Celebrities' },
    { title: 'Shopbop', desc: 'Designer Fashion Brands' },
    { title: 'Amazon Business', desc: 'Everything For Your Business' },
    { title: 'Prime Now', desc: '2-Hour Delivery on Everyday Items' },
    { title: 'Amazon Prime Music', desc: '100 million songs, ad-free' },
  ];

  return (
    <footer className="bg-[#232F3E] text-white mt-12 select-none font-sans">

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475A] hover:bg-[#485769] text-center py-3 text-xs md:text-sm font-semibold cursor-pointer transition-colors focus:outline-none flex items-center justify-center gap-1"
      >
        <ArrowUp size={14} /> Back to top
      </button>

      {/* Footer Links Directory Grid */}
      <div className="max-w-[2500px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-10 md:py-14 text-xs md:text-sm">
        {footerLinks.map((section, idx) => (
          <div key={idx} className="space-y-3.5">
            <h3 className="font-bold text-gray-100 text-sm md:text-base tracking-wide">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white hover:underline transition-colors text-xs font-semibold"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <hr className="border-t border-[#3a4553]" />

      {/* Footer Branding Logo & Selectors */}
      <div className="max-w-[2000px] mx-auto flex flex-col sm:flex-row items-center justify-center py-8 gap-6 px-4">
        {/* Logo */}
        <div className="flex items-baseline cursor-pointer shrink-0">
          <span className="text-xl font-bold tracking-tight text-white">amazon</span>
          <span className="text-sm font-bold text-[#FF9900]">.in</span>
        </div>

        {/* Language & Country selectors */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <button className="flex items-center gap-1.5 border border-gray-500 rounded px-3 py-1.5 hover:border-white transition-colors bg-transparent cursor-pointer text-gray-350">
            <Globe size={13} />
            <span>English</span>
            <span className="text-[7px] text-gray-400">▲▼</span>
          </button>

          <button className="flex items-center gap-1.5 border border-gray-500 rounded px-3 py-1.5 hover:border-white transition-colors bg-transparent cursor-pointer text-gray-350">
            <span>🇮🇳</span>
            <span>India</span>
          </button>
        </div>
      </div>

      {/* Sub-footer Directories Grid */}
      <div className="bg-[#131A22] border-t border-[#232F3E]/40 py-10 px-6">
        <div className="max-w-[2000px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-[10px] text-gray-400 font-semibold leading-normal">
          {subDirectories.map((dir, idx) => (
            <div key={idx} className="cursor-pointer group">
              <span className="text-gray-200 block group-hover:underline">{dir.title}</span>
              <span className="text-gray-500 font-medium block">{dir.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Copyright info */}
      <div className="bg-[#131A22] border-t border-gray-800/60 py-6 px-4 text-center text-xs text-gray-500 font-semibold">
        <div className="max-w-xl mx-auto flex flex-wrap justify-center gap-x-5 gap-y-2 mb-3">
          <a href="#" className="hover:underline hover:text-white transition-colors text-gray-400">
            Conditions of Use & Sale
          </a>
          <a href="#" className="hover:underline hover:text-white transition-colors text-gray-400">
            Privacy Notice
          </a>
          <a href="#" className="hover:underline hover:text-white transition-colors text-gray-400">
            Interest-Based Ads
          </a>
        </div>
        <p className="text-gray-600 font-semibold text-[11px]">
          © 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates
        </p>
      </div>

    </footer>
  );
}