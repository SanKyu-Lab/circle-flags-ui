import { renderToString } from 'solid-js/web'
import { App } from './solid-app.jsx'

export const render = () => renderToString(() => <App />)
