import dynamic from 'next/dynamic'
import type { NextPage } from 'next'

const SettingsPage = dynamic(() => import('../../components/Main/SettingsPage'), { ssr: false })

const Settings: NextPage = () => {
  return <SettingsPage />
}

export default Settings