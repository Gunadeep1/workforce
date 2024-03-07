import React, { useEffect, useState } from 'react'
import { Box, Grid, Stack } from '@mui/material'
import Text from '../../../../components/customText/Text';
import MainStyles from '../MainStyles'
import Input from '../../../../components/input/Input';
import CustomSelect from "../../../../components/customSelect/CustomSelect";
import Button from '../../../../components/customButton/Button';
import BaseTextareaAutosize from '@mui/material/TextareaAutosize';
import { styled } from "@mui/material/styles";
import LocalStorage from '../../../../utils/LocalStorage';
import TemplateApi from '../../../../apis/configurations/templates/TemplateApi';
import { isValid, validate_Char, validate_emptyField, } from '../../../../components/Validation';
import SearchSelect from '../../../../components/selectField/SearchSelect';
import RichTextEditor from 'react-rte';
import { addErrorMsg, addSuccessMsg } from '../../../../utils/utils';
import LoaderIcon from '../../../../assets/svg/sandtimer.svg';
import LoadingButton from '../../../../components/customButton/LoadingButton';

const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    width: 415px;
    font-family: 'Nunito', Nunito Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
   
    border: 1px solid #C7CCD3;
    &:focus-visible {
        outline: 0;
      }
  `,
);

function AddTemplateConfig() {
    var rolePermission = LocalStorage.getRolesData() ? LocalStorage.getRolesData().role_permissions.permissions : '';
    const classes = MainStyles();
    const [error, setError] = useState({});
    const [prefix, setPrefix] = useState([]);
    const [params, setParams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [btnloading, setBtnLoading] = useState(false);
    const [templateType, setTemplateType] = useState({
        templateType: '',
        templateText: "",
    });

    const [state, setState] = useState({
        name: "",
        subject: "",
        description: "",
        template: RichTextEditor.createValueFromString("", "html"),
    });

    useEffect(() => {
        getAllTemplates();

        // eslint-disable-next-line
    }, [])

    const handleCancel = () => {
        setState({
            slug: "",
            name: "",
            subject: "",
            description: "",
            template: RichTextEditor.createValueFromString("", "html"),

        });
        setEditorValue(RichTextEditor.createValueFromString("", "html"))
        setTemplateType({
            templateText: '',
            templateType: ''
        })

    };// eslint-disable-next-line
    const [editorValue, setEditorValue] = useState(
        RichTextEditor.createValueFromString("", "html")
    );
    const handleSubmit = (e) => {
        e.preventDefault();
        // const newState = state;
        // newState['request_id'] = LocalStorage.uid();

        // setState({ ...newState });
        setLoading(true)
        setBtnLoading(true)
        let errors = validateAll();
        state.template = editorValue.toString("html");
        setState({ ...state });
        if (isValid(errors)) {
            let newState = {
                request_id: LocalStorage.uid(),
                description: state.description,
                subject: state.subject,
                template: state.template,
                slug: state.slug
            }
            TemplateApi.updateTemplateIndex(newState, LocalStorage.getAccessToken()).then((res) => {
                setTimeout(() => {
                    if (res.data.statusCode == 1003) {
                        addSuccessMsg(`${name} ${res.data.message}`);
                        setState({
                            slug: "",
                            name: "",
                            subject: "",
                            description: "",
                            template: RichTextEditor.createValueFromString("", "html"),

                        });
                        setLoading(false)
                        setBtnLoading(false)
                        setEditorValue(RichTextEditor.createValueFromString("", "html"))
                        setTemplateType({
                            templateText: '',
                            templateType: ''
                        })
                    } else {
                        addErrorMsg(res.data.message);
                    }
                }, 300)

            });
        }
    };


    const getAllTemplates = () => {
        setLoading(true);
        setBtnLoading(true)
        TemplateApi.getTemplates(LocalStorage.uid(), LocalStorage.getAccessToken()).then(
            (res) => {
                setTimeout(() => {
                    if (res.data.statusCode == 1003) {
                        setPrefix(res.data.data);
                        setLoading(false);
                        setBtnLoading(false)

                    }
                }, 400)

            }
        )
    }

    const handleSelectTemplate = (e) => {
        setTemplateType({ ...templateType, [e.target.name]: e.target.value })
    }// eslint-disable-next-line 
    const handleValidationsEditor = (value) => {
        let err = error;
        err.template = validate_emptyField(value);
        setError(err);
    }

    const options = [
        { id: 1, value: 'Add to Subject' },
        { id: 2, value: 'Add to Template' },
    ];

    const getTemplateIndex = (id, value) => {
        TemplateApi.getTemplateIndex(LocalStorage.uid(), id, LocalStorage.getAccessToken()).then(
            (res) => {
                setTimeout(() => {
                    if (res.data.statusCode == 1003) {
                        setState({
                            ...res.data.data[0],
                            name: id,
                            // template: RichTextEditor.createValueFromString(`${res.data.data[0].template}`, "html")
                        });
                        setEditorValue(RichTextEditor.createValueFromString(`${res.data.data[0].template}`, "html"))
                        setParams(res.data.data[0].params);
                    }
                }, 300)

            }
        );
    };

    // const handleInputChange = (e) => {
    //     let { name, value } = e.target;
    //     if (name === 'name') {

    //         // eslint-disable-next-line             
    //         setState({ ...state, [name]: value });
    //        
    //     }
    //     setState({ ...state, [name]: value }, handleValidate(e.target));
    // };

    const [name, setName] = useState('');

    const handleInputChange = (e) => {
        console.log(e, "E");
        let { name, value } = e.target;
        if (name === 'name') {
            setState({ ...state, [name]: value });
            let slugName = prefix.filter(item => item.id == value)[0].value
            setName(slugName)
            getTemplateIndex(value);
        }
        setState({ ...state, [name]: value }, () => handleValidate(e.target));
    };


    const handleValidate = (input) => {
        // let input = e.target;
        let updatedErrors = { ...error };
        switch (input.name || input.tagName) {
            case "name":
                updatedErrors.name = validate_emptyField(input.value);
                break;
            case "subject":
                updatedErrors.subject = validate_Char(input.value);
                break;
            case "template":
                updatedErrors.template = validate_emptyField(input.value);
                break;
            case "description":
                updatedErrors.description = validate_Char(input.value);
                break;
            default:
                break;
        }
        setError(updatedErrors);
    };

    const validateAll = () => {
        let { name, subject, template, } = state;
        let errors = {};
        errors.name = validate_emptyField(name);
        errors.subject = validate_emptyField(subject);
        errors.template = validate_emptyField(template);
        // errors.description = validate_emptyField(description);

        return errors;
    }

    function onChangeEditor(value) {
        setState({ ...state, template: value })
        if (value.toString("html") == "<p><br></p>" || value.toString("html") == "<p></p>" || value.toString("html") == "<p></p><br>") {
            handleValidationsEditor("");
        } else {
            handleValidationsEditor(value.toString("html"));
        }
    }

    return (
        <Box className={classes.templateView}>
            {loading ?
                <Box className={classes.templateView}>
                    <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
                        <img src={LoaderIcon} height={100} width={100} alt='loading' />
                    </Stack>
                </Box>
                :
                <>
                    <Box className={classes.activeItemBox3}>
                        <Box className={classes.activeBoxHeading}><Text RegularBlack1 >Add Template</Text></Box>
                        <Grid container spacing={'32px'}>


                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <CustomSelect
                                    name='name'
                                    value={state.name ? state.name : ""}
                                    onChange={(e) => handleInputChange(e)}
                                    label='Template Name'
                                    options={prefix}
                                    commonSelect
                                />
                                <Text red>
                                    {error.name ? error.name : ""}
                                </Text>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Box >
                                    <Textarea className={classes.textarea} onChange={handleInputChange} type="text" value={state.description} name="description" aria-label="minimum height" minRows={2} placeholder="Description (optional)" />

                                </Box>
                                {error.description ?
                                    <Text red>
                                        {error.description ? error.description : ""}
                                    </Text>
                                    : null
                                }

                            </Grid>

                            <Grid item container lg={12} spacing={2} display='flex' justifyContent='space-between'>
                                <Grid item lg={4.2}>
                                    <CustomSelect
                                        name='templateText'
                                        value={templateType.templateText}
                                        onChange={handleSelectTemplate}
                                        options={params}
                                        label={<Text largeLabel>Text</Text>}
                                        commonSelect
                                    />
                                    <Text red>
                                        {error.templateText ? error.templateText : ""}
                                    </Text>
                                </Grid>
                                <Grid item lg={4.2}>
                                    <SearchSelect
                                        name='templateType'
                                        value={templateType.templateType}
                                        onChange={handleSelectTemplate}
                                        options={options}
                                        labelText={<Text largeLabel>Text</Text>}
                                        scrollTrue
                                    />
                                    <Text red>
                                        {error.templateType ? error.templateType : ""}
                                    </Text>
                                </Grid>

                                <Grid item lg={2}>
                                    {
                                        (templateType.templateType == '' || templateType.templateText == '') ?
                                            <Button addHeighDisabletButton>Add</Button> :
                                            <Button addHeightButton onClick={
                                                () => {
                                                    let err = error;
                                                    if (templateType.templateType == 1) {
                                                        let sub = state.subject + " " + params.filter(i => i.id == templateType.templateText)[0].parameter;
                                                        setState({ ...state, subject: sub });
                                                        err.subject = validate_emptyField(sub);
                                                    }
                                                    if (templateType.templateType == 2) {
                                                        let tempText = state.template.toString("html") + " " + params.filter(i => i.id == templateType.templateText)[0].parameter;
                                                        let text = RichTextEditor.createValueFromString(tempText, "html");
                                                        setState({ ...state, template: text });
                                                        if (tempText == "" || tempText == "<p><br></p>" || tempText == "<p></p>" || tempText == "<p></p><br>") {
                                                            err.template = validate_emptyField("");
                                                        } else {
                                                            err.template = validate_emptyField(tempText.toString("html"));
                                                        }
                                                    }
                                                    setError(err);
                                                }
                                            }>Add</Button>
                                    }
                                </Grid>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Input
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: 'subject',
                                        type: 'textarea',
                                        value: state.subject,
                                    }}

                                    clientInput
                                    labelText={'Subject'}
                                />
                                <Text red>{error.subject ? error.subject : ''}</Text>
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>

                                <RichTextEditor
                                    onChange={onChangeEditor}
                                    value={editorValue}
                                    editorClassName={classes.editorHeight}
                                    placeholder="Type something here..."
                                    labelText={'Template'}
                                />
                                {/* <Textarea className={classes.textarea} onChange={handleInputChange} type="text" name="template"  value= {state.template} aria-label="minimum height" minRows={5} placeholder="Template" /> */}
                                <Text red>{error.template ? error.template : ''}</Text>
                            </Grid>

                        </Grid>
                    </Box>
                    <Box display={'flex'} justifyContent={'end'} gap={'20px'} mt={'32px'}>

                        {state.name !== '' ?
                            <>
                                <Button cancelOutline onClick={handleCancel}>Cancel</Button>
                                {
                                    (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_create" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_template" && item.is_allowed == true))) ||
                                        (LocalStorage.getUserData().super_admin || (rolePermission.some(item => item.slug == "configurations_edit" && item.is_allowed == true) && rolePermission.some(item => item.slug == "configuration_template" && item.is_allowed == true))) ?
                                        <LoadingButton loading={btnloading} saveVerySmall onClick={handleSubmit}>{btnloading ? 'saving' : 'save'}</LoadingButton> :
                                        <LoadingButton saveLoaderDisable sx={{ height: '40px !important', minWidth: '100px !important' }}>{btnloading ? 'saving' : 'save'}</LoadingButton>
                                }
                            </>
                            : ''
                        }

                    </Box>
                </>

            }
        </Box>
    )
}

export default AddTemplateConfig;
