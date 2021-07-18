import { ProfileRelationsBoxWrapper } from '../ProfileRelations'

export function GenericRelationsBox(props) {
  const limitedElements = props.elements.length > 6
    ? props.elements.slice(0, 6)
    : [...props.elements]

  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {`${props.titleBox} (${props.elements.length})`}
      </h2>

      <ul>
        {limitedElements.map((element) => {
          return (
            <li key={element.id}>
              <a href={`/users/${element.title}`}>
                <img src={element.imageUrl} />
                <span>{element.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}