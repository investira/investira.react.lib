import React from 'react';
import { validators } from 'investira.sdk';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
    Success,
    Error,
    Button,
    Icon,
    DialogContentText,
    Typography,
    Loading,
    CenterInView
} from '../../components';

const initProps = { wrapContent: true, fullScreen: false };

// Decorator
const withDialog = (Component, pProps = initProps) => {
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const styles = {
        actions: {
            flex: '0 0 auto',
            display: 'flex',
            padding: '8px',
            alignItems: 'center',
            justifyContent: 'center'
        },
        contentSpacer: {
            marginBottom: '24px'
        },
        fetching: {
            height: '120px'
        }
    };

    const SuccessContent = props => {
        const { message, messages, onClick, width, height } = props;
        return (
            <>
                <DialogContentText component={'div'}>
                    <Success width={width} height={height} startAnimation />
                </DialogContentText>
                <DialogContentText component={'div'}>
                    <Typography
                        variant={'h5'}
                        color={'textPrimary'}
                        align={'center'}>
                        {messages?.success
                            ? messages.success.title
                            : 'Título de Sucesso'}
                    </Typography>
                    <Typography
                        variant={'body2'}
                        color={'textSecondary'}
                        align={'center'}>
                        {message
                            ? message
                            : messages?.success
                            ? messages.success.content
                            : 'Mensagem de sucesso'}
                    </Typography>
                </DialogContentText>

                <div style={styles.actions}>
                    <Button
                        key={'success_ok'}
                        variant={'outlined'}
                        color={'primary'}
                        //onClick={this.handleCloseDialog}
                        onClick={onClick}>
                        OK
                    </Button>
                </div>
            </>
        );
    };

    const ErrorContent = props => {
        const {
            message,
            messages,
            width,
            height,
            retryAction,
            onClick
        } = props;
        return (
            <>
                <DialogContentText component={'div'}>
                    <Error width={width} height={height} startAnimation />
                </DialogContentText>
                <DialogContentText component={'div'}>
                    <Typography
                        variant={'h5'}
                        color={'textPrimary'}
                        align={'center'}>
                        {messages && messages.error
                            ? messages.error.title
                            : 'Título de Error'}
                    </Typography>
                    <Typography
                        variant={'body2'}
                        color={'textSecondary'}
                        align={'center'}>
                        {message
                            ? message
                            : messages?.error
                            ? messages.error.content
                            : 'Mensagem de erro'}
                    </Typography>
                </DialogContentText>

                {retryAction && (
                    <div style={styles.actions}>
                        <Button
                            key={'success_ok'}
                            variant={'outlined'}
                            color={'primary'}
                            onClick={onClick}>
                            Tentar Novamente
                        </Button>
                    </div>
                )}
            </>
        );
    };

    class wrapComponent extends React.Component {
        initialState = {
            isOpen: false,
            status: null, //success | error
            message: null
        };

        body = {};

        state = {
            ...this.initialState
        };

        formSubmit = null;

        /**
         * Exibe o Dialog
         *
         * @param {object} pProps
         * {
         *   title: {
         *       label: 'Teste'
         *   },
         *  content: <p>Apenas um conteúdo de teste</p>,
         *   actions: [
         *       {
         *            label: 'Action',
         *            onClick: handleAction
         *        }
         *    ],
         *    messages: {
         *        success: {
         *            title: 'Sucesso!',
         *            content:
         *                'Contato foi bloqueado, a partir de agora nenhuma das suas infomações serão compartilhadas com José Silva.'
         *        },
         *        error: {
         *           title: 'Falha ao bloquear',
         *            content: 'Ocorreu um erro ao tentar bloquear o contato.'
         *        }
         *    },
         *    retryAction: handleAction
         * }
         */

        handleOpenDialog = pProps => {
            this.body = { ...pProps };

            this.setState({
                isOpen: true
            });
        };

        // Fechar Dialog
        handleCloseDialog = (e, callback) => {
            e && e.preventDefault();
            this.body = {};
            this.setState(
                {
                    ...this.initialState
                },
                () => {
                    validators.isFunction(callback) && callback();
                }
            );
            e && e.stopPropagation();
        };

        // Altera para Dialog de sucesso
        handleSuccess = (pMessage = null) => {
            this.setState({
                ...this.state,
                status: 'success',
                message: pMessage
            });
        };

        // Altera para Dialog de erro
        handleError = (pMessage = null) => {
            this.setState({
                ...this.state,
                status: 'error',
                message: pMessage
            });
        };

        // Altera para Dialog de loading
        handleFetching = () => {
            this.setState({ ...this.state, status: 'fetching' });
        };

        // Reinicia para Dialog default
        handleResetStatus = () => {
            this.setState({ ...this.state, status: 'null' });
        };

        // Ação de nova tentativa do Dialog de erro
        handleRetry = () => {
            const { retryAction } = this.body;
            retryAction && retryAction();
        };

        registerSubmitDialog = pFormikHandleSubmit => {
            this.formSubmit = pFormikHandleSubmit;
            // if (validators.isNull(this.formSubmit)) {
            //     this.formSubmit = pFormikHandleSubmit;
            // }
        };

        handleSubmitDialog = pEvent => {
            pEvent && pEvent.preventDefault();
            this.formSubmit && this.formSubmit();
            pEvent && pEvent.stopPropagation();
        };

        // Renders
        titleRender = pStatus => {
            const { title } = this.body;
            switch (pStatus) {
                case 'success':
                    return (
                        <DialogTitle
                            style={{
                                textAlign: 'right',
                                justifyContent: 'flex-end'
                            }}
                            onClose={this.handleCloseDialog}
                        />
                    );
                case 'error':
                    return (
                        <DialogTitle
                            style={{
                                textAlign: 'right',
                                justifyContent: 'flex-end'
                            }}
                            onClose={this.handleCloseDialog}
                        />
                    );
                case 'fetching':
                    return null;
                default:
                    return (
                        <DialogTitle
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                            {...(title.onclose === false
                                ? {}
                                : { onClose: this.handleCloseDialog })}>
                            {title.label && typeof title.label === 'string' ? (
                                <Typography
                                    variant={'h6'}
                                    color={'textPrimary'}>
                                    {title.label}
                                </Typography>
                            ) : (
                                title.label
                            )}
                        </DialogTitle>
                    );
            }
        };

        contentRender = pStatus => {
            const { content, messages, retryAction, actions } = this.body;
            const { message } = this.state;

            const withProps = {
                ...initProps,
                ...pProps
            };

            switch (pStatus) {
                case 'success':
                    return withProps.fullScreen ? (
                        <CenterInView>
                            <SuccessContent
                                messages={messages}
                                message={message}
                                onClick={this.handleCloseDialog}
                                width={175}
                                height={175}
                            />
                        </CenterInView>
                    ) : (
                        <SuccessContent
                            width={100}
                            height={100}
                            messages={messages}
                            message={message}
                            onClick={e =>
                                this.handleCloseDialog(
                                    e,
                                    messages?.success?.callback
                                )
                            }
                        />
                    );
                case 'error':
                    return withProps.fullScreen ? (
                        <CenterInView>
                            <ErrorContent
                                width={175}
                                height={175}
                                messages={messages}
                                message={message}
                                retryAction={retryAction}
                                onClick={this.handleRetr}
                            />
                        </CenterInView>
                    ) : (
                        <ErrorContent
                            width={100}
                            height={100}
                            messages={messages}
                            message={message}
                            retryAction={retryAction}
                            onClick={this.handleRetr}
                        />
                    );

                case 'fetching':
                    return (
                        <div style={styles.fetching}>
                            <CenterInView>
                                <Loading />
                            </CenterInView>
                        </div>
                    );
                default:
                    if (actions) {
                        return content;
                    } else {
                        return (
                            <div style={styles.contentSpacer}>{content}</div>
                        );
                    }
            }
        };

        actionRender = pStatus => {
            const { actions } = this.body;
            switch (pStatus) {
                case 'success':
                    return null;
                case 'error':
                    return null;
                case 'fetching':
                    return null;
                default:
                    return (
                        <DialogActions>
                            {actions.map((xAction, xIndex) => {
                                const xActionProps = {
                                    onClick: xAction.onClick,
                                    ...(xAction.type === 'submit' && {
                                        onClick: this.handleSubmitDialog
                                    }),
                                    style: { pointerEvents: 'all' },
                                    color: xAction.color || 'primary',
                                    ...(xAction.startIcon && {
                                        startIcon: (
                                            <Icon
                                                iconName={xAction.startIcon}
                                            />
                                        )
                                    })
                                };

                                return (
                                    <Button key={xIndex} {...xActionProps}>
                                        {xAction.label}
                                    </Button>
                                );
                            })}
                        </DialogActions>
                    );
            }
        };

        render() {
            const xProps = {
                onOpenDialog: this.handleOpenDialog,
                onCloseDialog: this.handleCloseDialog,
                onSuccess: this.handleSuccess,
                onError: this.handleError,
                onFetching: this.handleFetching,
                onResetStatus: this.handleResetStatus,
                registerSubmit: this.registerSubmitDialog,
                ...this.props
            };

            const withProps = {
                ...initProps,
                ...pProps
            };

            const { status } = this.state;
            const { title, content, actions } = this.body;

            if (!validators.isEmpty(actions) && actions.length > 3) {
                console.error('Não adicione mais que 3 actions para o dialog');
            }

            return (
                <>
                    <Component {...xProps} />
                    <Dialog
                        fullWidth
                        fullScreen={withProps.fullScreen}
                        open={this.state.isOpen}
                        TransitionComponent={Transition}
                        onClose={this.handleCloseDialog}
                        //PaperProps={{ style: { pointerEvents: 'none' } }}
                    >
                        {!validators.isEmpty(title) && this.titleRender(status)}

                        {!validators.isNull(content) &&
                            (withProps.wrapContent ? (
                                <DialogContent>
                                    {this.contentRender(status)}
                                </DialogContent>
                            ) : (
                                this.contentRender(status)
                            ))}

                        {!validators.isEmpty(actions) &&
                            this.actionRender(status)}
                    </Dialog>
                </>
            );
        }
    }

    return wrapComponent;
};

export default withDialog;
