import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import { ArrowForwardIosOutlined } from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import { BriefcaseEyeOutline } from 'mdi-material-ui';
import { useFormatter } from '../../../components/i18n';
import { Theme } from '../../../components/Theme';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNGETEXPORT, KNOWLEDGE_KNUPLOAD } from '../../../utils/hooks/useGranted';

const useStyles = makeStyles<Theme>((theme) => ({
  buttonHome: {
    marginRight: theme.spacing(2),
    padding: '0 5px 0 5px',
    minHeight: 20,
    textTransform: 'none',
  },
  button: {
    marginRight: theme.spacing(2),
    padding: '0 5px 0 5px',
    minHeight: 20,
    minWidth: 20,
    textTransform: 'none',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  arrow: {
    verticalAlign: 'middle',
    marginRight: 10,
  },
}));

const TopMenuCaseIncident = ({ id: caseId }: { id: string }) => {
  const location = useLocation();
  const { t } = useFormatter();
  const classes = useStyles();
  return (
    <>
      <Button
        component={Link}
        to="/dashboard/cases/incidents"
        variant="contained"
        size="small"
        color="primary"
        classes={{ root: classes.buttonHome }}
      >
        <BriefcaseEyeOutline className={classes.icon} fontSize="small" />
        {t('Incident response')}
      </Button>
      <ArrowForwardIosOutlined
        color="primary"
        classes={{ root: classes.arrow }}
      />
      <Button
        component={Link}
        to={`/dashboard/cases/incidents/${caseId}`}
        variant={
          location.pathname === `/dashboard/cases/incidents/${caseId}`
            ? 'contained'
            : 'text'
        }
        size="small"
        color={
          location.pathname === `/dashboard/cases/incidents/${caseId}`
            ? 'secondary'
            : 'primary'
        }
        classes={{ root: classes.button }}
        disabled={!caseId}
      >
        {t('Overview')}
      </Button>
      <Button
        component={Link}
        to={`/dashboard/cases/incidents/${caseId}/knowledge`}
        variant={
          location.pathname.includes(
            `/dashboard/cases/incidents/${caseId}/knowledge`,
          )
            ? 'contained'
            : 'text'
        }
        size="small"
        color={
          location.pathname.includes(
            `/dashboard/cases/incidents/${caseId}/knowledge`,
          )
            ? 'secondary'
            : 'primary'
        }
        classes={{ root: classes.button }}
        disabled={!caseId}
      >
        {t('Knowledge')}
      </Button>
      <Button
        component={Link}
        to={`/dashboard/cases/incidents/${caseId}/content`}
        variant={
          location.pathname === `/dashboard/cases/incidents/${caseId}/content`
            ? 'contained'
            : 'text'
        }
        size="small"
        color={
          location.pathname === `/dashboard/cases/incidents/${caseId}/content`
            ? 'secondary'
            : 'primary'
        }
        classes={{ root: classes.button }}
        disabled={!caseId}
      >
        {t('Content')}
      </Button>
      <Button
        component={Link}
        to={`/dashboard/cases/incidents/${caseId}/entities`}
        variant={
          location.pathname === `/dashboard/cases/incidents/${caseId}/entities`
            ? 'contained'
            : 'text'
        }
        size="small"
        color={
          location.pathname === `/dashboard/cases/incidents/${caseId}/entities`
            ? 'secondary'
            : 'primary'
        }
        classes={{ root: classes.button }}
        disabled={!caseId}
      >
        {t('Entities')}
      </Button>
      <Button
        component={Link}
        to={`/dashboard/cases/incidents/${caseId}/observables`}
        variant={
          location.pathname
          === `/dashboard/cases/incidents/${caseId}/observables`
            ? 'contained'
            : 'text'
        }
        size="small"
        color={
          location.pathname
          === `/dashboard/cases/incidents/${caseId}/observables`
            ? 'secondary'
            : 'primary'
        }
        classes={{ root: classes.button }}
        disabled={!caseId}
      >
        {t('Observables')}
      </Button>
      <Security needs={[KNOWLEDGE_KNUPLOAD, KNOWLEDGE_KNGETEXPORT]}>
        <Button
          component={Link}
          to={`/dashboard/cases/incidents/${caseId}/files`}
          variant={
            location.pathname === `/dashboard/cases/incidents/${caseId}/files`
              ? 'contained'
              : 'text'
          }
          size="small"
          color={
            location.pathname === `/dashboard/cases/incidents/${caseId}/files`
              ? 'secondary'
              : 'primary'
          }
          classes={{ root: classes.button }}
          disabled={!caseId}
        >
          {t('Data')}
        </Button>
      </Security>
    </>
  );
};

export default TopMenuCaseIncident;
