import React from 'react';

// HOC để thêm loading state vào component
const withLoading = (WrappedComponent) => {
  return class extends React.Component {
    state = { loading: true };

    componentDidMount() {
      // Giả lập việc tải dữ liệu
      setTimeout(() => {
        this.setState({ loading: false });
      }, 2000);
    }

    render() {
      const { loading } = this.state;
      return loading ? <div>Loading...</div> : <WrappedComponent {...this.props} />;
    }
  };
};

export default withLoading; 