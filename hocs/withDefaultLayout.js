import DefaultLayout from './../layouts/DefaultLayout';

const withDefaultLayout = (props) => {
  props.Layout = DefaultLayout;
  return props;
};

export default withDefaultLayout;
