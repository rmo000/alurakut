import Box from '../Box'
import { AlurakutProfileSidebarMenuDefault } from '../../lib/AlurakutCommons'

export function ProfileSideBar(props) {
  return (
    <aside className="profileArea" style={{ gridArea: 'profileArea' }}>
      <Box>
        <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
        <hr />
        <p>
          <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
            @${props.githubUser}
          </a>
        </p>
        <hr />

        <AlurakutProfileSidebarMenuDefault />
      </Box>
    </aside>
  )
}