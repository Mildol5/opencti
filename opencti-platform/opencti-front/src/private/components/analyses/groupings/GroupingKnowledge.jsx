import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import * as R from 'ramda';
import { graphql, createFragmentContainer } from 'react-relay';
import withStyles from '@mui/styles/withStyles';
import { Route, withRouter } from 'react-router-dom';
import { propOr } from 'ramda';
import { QueryRenderer } from '../../../../relay/environment';
import ContainerHeader from '../../common/containers/ContainerHeader';
import GroupingKnowledgeGraph, {
  groupingKnowledgeGraphQuery,
} from './GroupingKnowledgeGraph';
import GroupingKnowledgeCorrelation, {
  groupingKnowledgeCorrelationQuery,
} from './GroupingKnowledgeCorrelation';
import Loader from '../../../../components/Loader';
import GroupingPopover from './GroupingPopover';
import AttackPatternsMatrix from '../../techniques/attack_patterns/AttackPatternsMatrix';
import {
  buildViewParamsFromUrlAndStorage,
  saveViewParameters,
} from '../../../../utils/ListParameters';
import ContainerContent, {
  containerContentQuery,
} from '../../common/containers/ContainerContent';

const styles = () => ({
  container: {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
  },
});

export const groupingKnowledgeAttackPatternsGraphQuery = graphql`
  query GroupingKnowledgeAttackPatternsGraphQuery($id: String!) {
    grouping(id: $id) {
      id
      name
      context
      x_opencti_graph_data
      confidence
      createdBy {
        ... on Identity {
          id
          name
          entity_type
        }
      }
      objectMarking {
        edges {
          node {
            id
            definition_type
            definition
            x_opencti_order
            x_opencti_color
          }
        }
      }
      objects(all: true, types: ["Attack-Pattern"]) {
        edges {
          node {
            ... on AttackPattern {
              id
              entity_type
              parent_types
              name
              description
              x_mitre_platforms
              x_mitre_permissions_required
              x_mitre_id
              x_mitre_detection
              isSubAttackPattern
              parentAttackPatterns {
                edges {
                  node {
                    id
                    name
                    description
                    x_mitre_id
                  }
                }
              }
              subAttackPatterns {
                edges {
                  node {
                    id
                    name
                    description
                    x_mitre_id
                  }
                }
              }
              killChainPhases {
                edges {
                  node {
                    id
                    kill_chain_name
                    phase_name
                    x_opencti_order
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

class GroupingKnowledgeComponent extends Component {
  constructor(props) {
    const LOCAL_STORAGE_KEY = `grouping-knowledge-${props.grouping.id}`;
    super(props);
    const params = buildViewParamsFromUrlAndStorage(
      props.history,
      props.location,
      LOCAL_STORAGE_KEY,
    );
    this.state = {
      currentModeOnlyActive: propOr(false, 'currentModeOnlyActive', params),
      currentColorsReversed: propOr(false, 'currentColorsReversed', params),
      currentKillChain: propOr('mitre-attack', 'currentKillChain', params),
    };
  }

  saveView() {
    saveViewParameters(
      this.props.history,
      this.props.location,
      `grouping-knowledge-${this.props.grouping.id}`,
      this.state,
    );
  }

  handleToggleModeOnlyActive() {
    this.setState(
      { currentModeOnlyActive: !this.state.currentModeOnlyActive },
      () => this.saveView(),
    );
  }

  handleToggleColorsReversed() {
    this.setState(
      { currentColorsReversed: !this.state.currentColorsReversed },
      () => this.saveView(),
    );
  }

  handleChangeKillChain(event) {
    const { value } = event.target;
    this.setState({ currentKillChain: value }, () => this.saveView());
  }

  render() {
    const {
      classes,
      grouping,
      location,
      match: {
        params: { mode },
      },
    } = this.props;
    const { currentModeOnlyActive, currentColorsReversed, currentKillChain } = this.state;
    return (
      <div
        className={classes.container}
        id={location.pathname.includes('matrix') ? 'parent' : 'container'}
      >
        {mode !== 'graph' && (
          <ContainerHeader
            container={grouping}
            PopoverComponent={<GroupingPopover />}
            link={`/dashboard/analyses/groupings/${grouping.id}/knowledge`}
            modes={['graph', 'content', 'correlation', 'matrix']}
            currentMode={mode}
            knowledge={true}
          />
        )}
        <Route
          exact
          path="/dashboard/analyses/groupings/:groupingId/knowledge/graph"
          render={() => (
            <QueryRenderer
              query={groupingKnowledgeGraphQuery}
              variables={{ id: grouping.id }}
              render={({ props }) => {
                if (props && props.grouping) {
                  return (
                    <GroupingKnowledgeGraph
                      grouping={props.grouping}
                      mode={mode}
                    />
                  );
                }
                return <Loader />;
              }}
            />
          )}
        />
        <Route
          exact
          path="/dashboard/analyses/groupings/:groupingId/knowledge/content"
          render={() => (
            <QueryRenderer
              query={containerContentQuery}
              variables={{ id: grouping.id }}
              render={({ props }) => {
                if (props && props.container) {
                  return <ContainerContent containerData={props.container} />;
                }
                return <Loader />;
              }}
            />
          )}
        />
        <Route
          exact
          path="/dashboard/analyses/groupings/:groupingId/knowledge/correlation"
          render={() => (
            <QueryRenderer
              query={groupingKnowledgeCorrelationQuery}
              variables={{ id: grouping.id }}
              render={({ props }) => {
                if (props && props.grouping) {
                  return (
                    <GroupingKnowledgeCorrelation grouping={props.grouping} />
                  );
                }
                return <Loader />;
              }}
            />
          )}
        />
        <Route
          exact
          path="/dashboard/analyses/groupings/:groupingId/knowledge/matrix"
          render={() => (
            <QueryRenderer
              query={groupingKnowledgeAttackPatternsGraphQuery}
              variables={{ id: grouping.id }}
              render={({ props }) => {
                if (props && props.grouping) {
                  const attackPatterns = R.pipe(
                    R.map((n) => n.node),
                    R.filter((n) => n.entity_type === 'Attack-Pattern'),
                  )(props.grouping.objects.edges);
                  return (
                    <AttackPatternsMatrix
                      entity={grouping}
                      attackPatterns={attackPatterns}
                      searchTerm=""
                      currentKillChain={currentKillChain}
                      currentModeOnlyActive={currentModeOnlyActive}
                      currentColorsReversed={currentColorsReversed}
                      handleChangeKillChain={this.handleChangeKillChain.bind(
                        this,
                      )}
                      handleToggleColorsReversed={this.handleToggleColorsReversed.bind(
                        this,
                      )}
                      handleToggleModeOnlyActive={this.handleToggleModeOnlyActive.bind(
                        this,
                      )}
                    />
                  );
                }
                return <Loader />;
              }}
            />
          )}
        />
      </div>
    );
  }
}

GroupingKnowledgeComponent.propTypes = {
  grouping: PropTypes.object,
  mode: PropTypes.string,
  classes: PropTypes.object,
  t: PropTypes.func,
  history: PropTypes.object,
};

const GroupingKnowledge = createFragmentContainer(GroupingKnowledgeComponent, {
  grouping: graphql`
    fragment GroupingKnowledge_grouping on Grouping {
      id
      editContext {
        name
        focusOn
      }
      ...ContainerHeader_container
    }
  `,
});

export default R.compose(withRouter, withStyles(styles))(GroupingKnowledge);
