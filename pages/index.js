import { useEffect, useState } from 'react'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'

import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { ProfileSideBar } from '../src/components/ProfileSideBar'
import { GenericRelationsBox } from '../src/components/GenericRelationsBox'
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'

export default function Home(props) {
  const githubUser = props.githubUser
  const [followers, setFollowers] = useState([])
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [communities, setCommunities] = useState([])
  const [communityPeople, setCommunityPeople] = useState([])

  useEffect(() => {

    //GET - followers
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then(response => response.json())
      .then(data => setFollowers(data.map(({ id, login, avatar_url }) => {
        return {
          id,
          title: login,
          imageUrl: avatar_url
        }
      })))

    // API GraphQL - Dato CMS
    const token = '6006dfc90574b6a6783bf4f48722b7'

    // AllCommunities
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: `query {
            allCommunities{
              id
              title
              imageUrl
              creatorSlug
            }
          }`
      })
    }).then(response => response.json())
      .then(response => setCommunities(response.data.allCommunities))

    // CommunityPeople
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: `query {
              allCommunityPeople{
                id
                title
                imageUrl
              }
            }`
      })
    }).then(response => response.json())
      .then(response => setCommunityPeople(response.data.allCommunityPeople))

  }, [])

  function handleCreateCommunity(event) {
    event.preventDefault()

    const newCommunity = {
      title,
      imageUrl,
      creatorSlug: githubUser
    }

    fetch('/api/communities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newCommunity)
    }).then(async response => {
      const {record} = await response.json()

      const updatedCommunities = [
        ...communities,
        {
          ...newCommunity,
          id: record.id
        }
      ]
      setCommunities(updatedCommunities)

      setTitle('')
      setImageUrl('')
    })
  }

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem Vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={handleCreateCommunity}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <GenericRelationsBox
            elements={followers}
            titleBox={'Seguidores'}
          />
          <GenericRelationsBox
            elements={communities}
            titleBox={'Comunidades'}
          />
          <GenericRelationsBox
            elements={communityPeople}
            titleBox={'Pessoas da comunidade'}
          />

        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context){
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN

  try{
    const { githubUser } = jwt.decode(token)
    
    const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth',{
      headers: {
        'Authorization' : token,
        'Content-Type': 'application/json'
      }
    }).then(async response => response.json())
    
    if(!isAuthenticated){
      return{
        redirect: {
          destination: '/login',
          permanent: false
        }
      }
    }
    
    return{
      props: {
        githubUser
      }
    }
  }catch{
    return{
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
}