import React from 'react';

const infiniteScroll = Component => {
    return class InfiniteScroll extends React.Component {
        onScroll = () => {
            let xElement = this.props.parentRef.current;

            if (
                xElement.scrollHeight - xElement.clientHeight >=
                    xElement.scrollTop - 100 &&
                !this.props.isLoading
            ) {
                this.props.loadDataAction && this.props.loadDataAction();
            }
        };

        componentDidMount() {
            if (this.props.parentRef && this.props.parentRef.current) {
                this.props.parentRef.current.onscroll = () => {
                    this.onScroll();
                };
            }
        }

        componentDidUpdate() {
            this.props.parentRef.current.onscroll = () => {
                this.onScroll();
            };
        }

        render() {
            return Component ? <Component {...this.props} /> : null;
        }
    };
};

export default infiniteScroll;
