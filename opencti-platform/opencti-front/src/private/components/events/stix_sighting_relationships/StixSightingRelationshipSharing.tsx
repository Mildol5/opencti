import React, { FunctionComponent, useState } from 'react';
import { graphql } from 'react-relay';
import makeStyles from '@mui/styles/makeStyles';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { AccountBalanceOutlined, ShareOutlined } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import type { FormikHelpers } from 'formik/dist/types';
import { Form, Formik } from 'formik';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EETooltip from '@components/common/entreprise_edition/EETooltip';
import ObjectOrganizationField from '../../common/form/ObjectOrganizationField';
import { StixSightingRelationshipSharingQuery$data } from './__generated__/StixSightingRelationshipSharingQuery.graphql';
import { commitMutation, QueryRenderer } from '../../../../relay/environment';
import { useFormatter } from '../../../../components/i18n';
import { truncate } from '../../../../utils/String';
import useGranted, { KNOWLEDGE_KNUPDATE_KNORGARESTRICT } from '../../../../utils/hooks/useGranted';
import useEnterpriseEdition from '../../../../utils/hooks/useEnterpriseEdition';

// region types
interface ContainerHeaderSharedProps {
  elementId: string;
  variant: string;
  disabled: boolean;
}

interface OrganizationForm {
  objectOrganization: { value: string; label: string };
}

// endregion

const useStyles = makeStyles(() => ({
  organization: {
    margin: '0 7px 0 0',
    float: 'left',
    fontSize: 12,
    lineHeight: '12px',
    height: 28,
  },
}));

const containerHeaderSharedQuery = graphql`
  query StixSightingRelationshipSharingQuery($id: String!) {
    stixSightingRelationship(id: $id) {
      objectOrganization {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

const containerHeaderSharedQueryGroupDeleteMutation = graphql`
  mutation StixSightingRelationshipSharingGroupDeleteMutation(
    $id: ID!
    $organizationId: ID!
  ) {
    stixSightingRelationshipEdit(id: $id) {
      restrictionOrganizationDelete(organizationId: $organizationId) {
        id
        objectOrganization {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`;

const containerHeaderSharedGroupAddMutation = graphql`
  mutation StixSightingRelationshipSharingGroupAddMutation(
    $id: ID!
    $organizationId: ID!
  ) {
    stixSightingRelationshipEdit(id: $id) {
      restrictionOrganizationAdd(organizationId: $organizationId) {
        id
        objectOrganization {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`;

const StixSightingRelationshipSharing: FunctionComponent<ContainerHeaderSharedProps> = ({ elementId, disabled }) => {
  const classes = useStyles();
  const { t } = useFormatter();
  const [displaySharing, setDisplaySharing] = useState(false);
  const isEnterpriseEdition = useEnterpriseEdition();
  const userIsOrganizationEditor = useGranted([KNOWLEDGE_KNUPDATE_KNORGARESTRICT]);
  // If user not an organization organizer, return empty div
  if (!userIsOrganizationEditor) {
    return <div style={{ marginTop: -20 }} />;
  }
  const handleOpenSharing = () => setDisplaySharing(true);
  const handleCloseSharing = () => setDisplaySharing(false);
  const removeOrganization = (organizationId: string) => {
    commitMutation({
      mutation: containerHeaderSharedQueryGroupDeleteMutation,
      variables: { id: elementId, organizationId },
      onCompleted: undefined,
      updater: undefined,
      optimisticUpdater: undefined,
      optimisticResponse: undefined,
      onError: undefined,
      setSubmitting: undefined,
    });
  };
  const onSubmitOrganizations = (
    values: OrganizationForm,
    { setSubmitting, resetForm }: FormikHelpers<OrganizationForm>,
  ) => {
    const { objectOrganization } = values;
    if (objectOrganization.value) {
      commitMutation({
        mutation: containerHeaderSharedGroupAddMutation,
        variables: { id: elementId, organizationId: objectOrganization.value },
        onCompleted: () => {
          setSubmitting(false);
          resetForm();
          setDisplaySharing(false);
        },
        updater: undefined,
        optimisticUpdater: undefined,
        optimisticResponse: undefined,
        onError: undefined,
        setSubmitting: undefined,
      });
    }
  };
  const render = ({
    stixSightingRelationship,
  }: StixSightingRelationshipSharingQuery$data) => {
    const edges = stixSightingRelationship?.objectOrganization?.edges ?? [];
    return (
      <React.Fragment>
        <Typography variant="h3" gutterBottom={true} style={{ float: 'left' }}>
          {t('Organizations sharing')}
        </Typography>
        <EETooltip title='Share with an organization'>
          <IconButton
            color={isEnterpriseEdition ? 'warning' : 'ee'}
            aria-label="Label"
            onClick={isEnterpriseEdition ? handleOpenSharing : () => {}}
            style={{ float: 'left', margin: '-15px 0 0 -2px' }}
            size="large"
            disabled={disabled}
          >
            <ShareOutlined fontSize="small" />
          </IconButton>
        </EETooltip>
        <div className="clearfix" />
        {edges.map((edge) => (
          <Tooltip key={edge.node.id} title={edge.node.name}>
            <Chip
              icon={<AccountBalanceOutlined />}
              classes={{ root: classes.organization }}
              color="warning"
              variant="outlined"
              label={truncate(edge.node.name, 15)}
              onDelete={() => removeOrganization(edge.node.id)}
            />
          </Tooltip>
        ))}
        <div className="clearfix" />
        <Formik
          initialValues={{ objectOrganization: { value: '', label: '' } }}
          onSubmit={onSubmitOrganizations}
          onReset={handleCloseSharing}
        >
          {({ submitForm, handleReset, isSubmitting }) => (
            <Dialog
              PaperProps={{ elevation: 1 }}
              open={displaySharing}
              onClose={() => handleReset()}
              fullWidth={true}
            >
              <DialogTitle>{t('Share with an organization')}</DialogTitle>
              <DialogContent style={{ overflowY: 'hidden' }}>
                <Form>
                  <ObjectOrganizationField
                    name="objectOrganization"
                    style={{ width: '100%' }}
                    label={t('Organization')}
                    multiple={false}
                  />
                </Form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleReset} disabled={isSubmitting}>
                  {t('Close')}
                </Button>
                <Button
                  onClick={submitForm}
                  disabled={isSubmitting}
                  color="secondary"
                >
                  {t('Share')}
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Formik>
      </React.Fragment>
    );
  };
  return (
    <QueryRenderer
      query={containerHeaderSharedQuery}
      variables={{ id: elementId }}
      render={(result: {
        props: StixSightingRelationshipSharingQuery$data;
      }) => {
        if (result.props) {
          return render(result.props);
        }
        return <div />;
      }}
    />
  );
};

export default StixSightingRelationshipSharing;
