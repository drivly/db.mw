import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import Logo from './components/Logo'

const config: DocsThemeConfig = {
  logo: <Logo/>,
  project: {
    link: 'https://github.com/drivly/db.mw',
  },
  chat: {
    link: 'https://discord.gg/NhYuABP9',
  },
//   docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
  footer: {
    text: '彡 DB.MW',
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – DB.MW Multi World Database',
    }
  }
}

export default config
