import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import eslintConfigPrettier from 'eslint-config-prettier'

const config = [...nextVitals, ...nextTs, eslintConfigPrettier]

export default config
