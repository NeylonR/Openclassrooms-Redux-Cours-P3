import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import colors from '../../utils/style/colors';
import { Loader } from '../../utils/style/Atoms';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../utils/selectors';
import { useQuery } from "react-query";


const CardsContainer = styled.div`
  display: grid;
  gap: 24px;
  grid-template-rows: 350px 350px;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  justify-items: center;
`;

const PageTitle = styled.h1`
  font-size: 30px;
  text-align: center;
  padding-bottom: 30px;
  color: ${({ theme }) => (theme === 'light' ? '#000000' : '#ffffff')};
`;

const PageSubtitle = styled.h2`
  font-size: 20px;
  color: ${colors.secondary};
  font-weight: 300;
  text-align: center;
  padding-bottom: 30px;
  color: ${({ theme }) => (theme === 'light' ? '#000000' : '#ffffff')};
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

function Freelances() {
  const theme = useSelector(selectTheme);

  const {
    isLoading,
    data,
    error
  } = useQuery('freelances', async () => {
    const response = await fetch('http://localhost:8000/freelances');
    const data = await response.json();
    return data;
  });

  if (error) {
    return <span>Il y a un problème</span>;
  };

  return (
    <div>
      <PageTitle theme={theme}>Trouvez votre prestataire</PageTitle>
      <PageSubtitle theme={theme}>
        Chez Shiny nous réunissons les meilleurs profils pour vous.
      </PageSubtitle>
      {isLoading ? (
        <LoaderWrapper>
          <Loader theme={theme} data-testid="loader" />
        </LoaderWrapper>
      ) : (
        <CardsContainer>
          {data?.freelancersList.map((profile) => (
            <Link key={`freelance-${profile.id}`} to={`/profile/${profile.id}`}>
              <Card
                label={profile.job}
                title={profile.name}
                picture={profile.picture}
                theme={theme}
              />
            </Link>
          ))}
        </CardsContainer>
      )}
    </div>
  )
};

export default Freelances;