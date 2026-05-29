import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Strip Vietnamese diacritics so heading anchors become clean ASCII slugs
// (e.g. "Tóm tắt" -> "tom-tat"), keeping all in-page URLs accent-free.
function toAsciiSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '') // strip combining marks
    .replace(/__NOOP__/g, '')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Remark plugin: assign an ASCII id to every heading. Runs before Docusaurus's
// own heading plugin, which respects a pre-set data.id.
function remarkAsciiHeadingIds() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collectText = (node: any): string =>
    node.value ?? (node.children ? node.children.map(collectText).join('') : '');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const walk = (node: any) => {
    if (node.type === 'heading') {
      const id = toAsciiSlug(collectText(node));
      if (id) {
        node.data = node.data || {};
        node.data.id = id;
        node.data.hProperties = {...(node.data.hProperties || {}), id};
      }
    }
    if (node.children) node.children.forEach(walk);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => walk(tree);
}

const config: Config = {
  title: 'Học thuật toán bằng hình ảnh',
  tagline: 'Học tư duy lập trình và thuật toán bằng tương tác trực quan, tiếng Việt, miễn phí',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // TODO: đổi thành tên miền thật trên VPS khi triển khai.
  url: 'https://hoc-thuat-toan.example.com',
  baseUrl: '/',

  // GitHub của tác giả (đổi nếu cần).
  organizationName: 'haodpsut',
  projectName: 'hoc-thuat-toan',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Đặt ngôn ngữ trang là tiếng Việt (html lang="vi").
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // bài giảng nằm ngay ở gốc, không có tiền tố /docs
          editUrl: 'https://github.com/haodpsut/hoc-thuat-toan/tree/main/',
          beforeDefaultRemarkPlugins: [remarkAsciiHeadingIds], // anchor không dấu
        },
        blog: false, // không dùng blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // Tìm kiếm cục bộ: chạy hoàn toàn trong trình duyệt, không cần dịch vụ ngoài.
  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 5,
        searchResultContextMaxLength: 50,
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true, // nút ẩn/hiện sidebar trái
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'Học thuật toán',
      logo: {
        alt: 'Học thuật toán bằng hình ảnh',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Bài giảng',
        },
        {
          href: 'https://github.com/haodpsut/hoc-thuat-toan',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Nội dung',
          items: [
            {label: 'Giới thiệu', to: '/'},
            {label: 'Sắp xếp', to: '/sap-xep'},
            {label: 'Đồ thị', to: '/do-thi'},
            {label: 'Cây', to: '/cay'},
          ],
        },
        {
          title: 'Đơn vị',
          items: [
            {label: 'Trung tâm CAIRA', href: 'https://www.coregenaihub.com/'},
            {label: 'Đại học Kiến trúc Đà Nẵng', href: 'https://www.coregenaihub.com/'},
            {label: 'Hợp tác và liên hệ', href: 'https://www.coregenaihub.com/'},
          ],
        },
        {
          title: 'Dự án',
          items: [
            {label: 'Mã nguồn mở', href: 'https://github.com/haodpsut/hoc-thuat-toan'},
            {label: 'Đóng góp nội dung', href: 'https://github.com/haodpsut/hoc-thuat-toan'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Trung tâm CAIRA, Đại học Kiến trúc Đà Nẵng · Học thuật toán bằng hình ảnh · Dự án mở và miễn phí cho cộng đồng.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
