import { SiteClient } from 'datocms-client'

export default async function Communities(request, response) {

  if(request.method === 'POST'){
    const token = '7620be6c13dedc04b657684e154c9b'
    const client = new SiteClient(token)
  
    const record = await client.items.create({
      itemType: '975912',
      ...request.body
    })
  
    response.json({
      dados: 'Alguma coisa',
      record
    })

    return
  }

  response.status(404).json({
    message: 'Ainda não temos nada no GET, mas no POST tem!'
  })
}