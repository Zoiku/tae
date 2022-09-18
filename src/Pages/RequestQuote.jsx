import "../Styles/RequestQuote.css"
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { GenericPrimaryButton, GenericSecondary } from "../Material/Button";
import { useReducer } from "react";
import { INITIAL_STATE, formReducer } from "../Reducers/FormReducer";
import { INPUTING, REQUEST_FAILED, REQUEST_SUCCESSFUL, SEND_REQUEST } from "../Reducers/Actions";
import axios from "axios";

const SPECIFICATION_DETAILS = {
    ["Teak Round Logs"]: [{ name: "length", label: "Length", units: [{ name: "lengthUnit", values: ["cm", "m"] }] }, { name: "diameter", label: "Diameter", units: [{ name: "diameterUnit", values: ["mm", "cm"] }] }, { name: "quantity", label: "Quantity", units: [{ name: "quantityUnit", values: ["cm", "m"] }] }],
    ["Teak Square Logs"]: [{ name: "length", label: "Length", units: [{ name: "lengthUnit", values: ["cm", "m"] }] }, { name: "thickness", label: "Thickness", units: [{ name: "thicknessUnit", values: ["mm", "cm"] }] }, { name: "quantity", label: "Quantity", units: [{ name: "quantityUnit", values: ["cm", "m"] }] }, { name: "width", label: "Width", units: [{ name: "widthUnit", values: ["mm", "cm"] }] }, { name: "drying", label: "Drying" },],
}

const RequestQuote = () => {
    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE)
    const [countries, setCountries] = useState(null);
    const navigate = useNavigate();
    const { search } = useLocation();
    const { product } = useMemo(() => Object.fromEntries([...new URLSearchParams(search)]), [search]);
    const parsedProduct = useMemo(() => JSON.parse(product), [product]);

    const handleChange = (e) => { dispatch({ type: INPUTING, prop: e.target.name, value: e.target.value }); }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(state);
    };

    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            try {
                const { data } = await axios.get("https://restcountries.com/v2/all", { signal: abortController.signal });
                setCountries(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
        return () => abortController.abort();
    }, []);

    return (
        <div className="RequestQuote-Page">
            <div>
                <div className="request-quote-page-header">
                    <div>{parsedProduct.name}</div>
                    <div>{parsedProduct.description}</div>
                </div>

                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { width: '100%', margin: "30px 0" },
                    }}
                    autoComplete="off"
                    className="request-quote-page-form"
                    onSubmit={handleSubmit}
                >
                    <section>
                        <div className="request-quote-section-title">1. Profile Information</div>
                        <div className="request-quote-section-body profile-information-body">
                            <div>Types of Species: {parsedProduct.speciesType}</div>
                            <div>Container Size: {parsedProduct.containerSize}</div>
                            <div>Species: {parsedProduct.species}</div>
                            <div>Volume Per Container: {parsedProduct.volume} {parsedProduct.volumeUnit}</div>
                            <div>Origin: {parsedProduct.origin}</div>
                        </div>
                    </section>

                    <section>
                        <div className="request-quote-section-title">2. Specifications</div>
                        <div className="request-quote-section-body select-input-form">
                            {
                                SPECIFICATION_DETAILS[parsedProduct.name].map(specification =>
                                    <div>
                                        <div>{specification.label}</div>
                                        <div className="select-input-form-with-units">
                                            <TextField required onChange={handleChange} size="small" fullWidth type="text" name={specification.name} label={specification.label} variant="outlined" />
                                            {
                                                specification.units &&
                                                specification.units.length > 0 &&
                                                specification.units.map(specificationUnits =>
                                                    <FormControl required key={specificationUnits.name} size="small" fullWidth>
                                                        <InputLabel>Units</InputLabel>
                                                        <Select key={specificationUnits.name} size="small" onChange={handleChange} name={specificationUnits.name} label="Units">
                                                            {
                                                                specificationUnits.values &&
                                                                specificationUnits.values.length > 0 &&
                                                                specificationUnits.values.map(value =>
                                                                    <MenuItem key={value} value={value}>
                                                                        {value}
                                                                    </MenuItem>
                                                                )
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                            <div>
                                <div>Additional Information</div>
                                <div>
                                    <TextField onChange={handleChange} multiline rows={1} size="small" fullWidth type="text" name="additionalInformation" label="Additional Information" variant="outlined" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="request-quote-section-title">3. Pricing and Delivery Information</div>
                        <div className="request-quote-section-body select-input-form">
                            <div>
                                <div>Incoterm</div>
                                <div>
                                    <FormControl required size="small" fullWidth>
                                        <InputLabel id="demo-multiple-chip-label">Incoterm</InputLabel>
                                        <Select onChange={handleChange} name="incoterm" label="Country">
                                            <MenuItem value="FOB">
                                                FOB
                                            </MenuItem>
                                            <MenuItem value="CFR">
                                                CFR
                                            </MenuItem>
                                            <MenuItem value="CIF">
                                                CIF
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>

                            <div>
                                <div>Destination</div>
                                <div>
                                    <FormControl required size="small" fullWidth>
                                        <InputLabel id="demo-multiple-chip-label">Destination</InputLabel>
                                        <Select onChange={handleChange} required name="destination" label="Destination">
                                            {
                                                countries &&
                                                countries.map(country =>
                                                    <MenuItem key={country.name} value={country.name}>
                                                        <div style={{ display: "flex", alignItems: "center" }}><img style={{ marginRight: 10 }} alt={country.name} width={30} src={country.flags.svg} /> {country.name}</div>
                                                    </MenuItem>
                                                )
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>

                            <div>
                                <div>Destination Port</div>
                                <div>
                                    <TextField required onChange={handleChange} size="small" fullWidth type="text" name="port" label="Destination Port" variant="outlined" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="request-quote-section-title">4. Request Settings</div>
                        <div className="request-quote-section-body select-input-form">
                            <div>
                                <div>Validity</div>
                                <div>
                                    <FormControl required size="small" fullWidth>
                                        <InputLabel id="demo-multiple-chip-label">Validity</InputLabel>
                                        <Select onChange={handleChange} required name="validity" label="Validity">
                                            <MenuItem value="7">
                                                7 Days
                                            </MenuItem>
                                            <MenuItem value="14">
                                                14 Days
                                            </MenuItem>
                                            <MenuItem value="21">
                                                21 Days
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Stack spacing={2} direction="row">
                        <GenericSecondary onClick={() => navigate("/")} variant="text">Back</GenericSecondary>
                        <GenericPrimaryButton type="submit" loading={state.requestState.loading} variant="containerd">Post Quote</GenericPrimaryButton>
                    </Stack>
                </Box>
            </div>
        </div>
    );
};

export default RequestQuote;