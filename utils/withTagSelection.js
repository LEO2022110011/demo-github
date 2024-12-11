import React from 'react';

// HOC để thêm loading state và tag selection vào component
const withTagSelection = (WrappedComponent) => {
  return class extends React.Component {
    state = { selectedTagId: null };

    handleTagClick = (tagId) => {
      console.log("Tag clicked:", tagId); // Debugging
      this.setState({ selectedTagId: tagId });
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          selectedTagId={this.state.selectedTagId}
          onTagClick={this.handleTagClick}
        />
      );
    }
  };
};

export default withTagSelection; 