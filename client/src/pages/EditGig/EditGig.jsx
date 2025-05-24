import React, { useEffect, useReducer, useState, useRef } from "react";
import "./EditGig.scss";
import { gigReducer, GIG_INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate, useParams } from "react-router-dom";
import { FaCloudUploadAlt, FaImages, FaPlus, FaTimes } from "react-icons/fa";
import Loader from "../../components/loader/Loader";

const EditGig = () => {
    const { id } = useParams();
    const [singleFile, setSingleFile] = useState(undefined);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState({});

    const [state, dispatch] = useReducer(gigReducer, GIG_INITIAL_STATE);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch the gig data
    const { isLoading, error, data } = useQuery({
        queryKey: ["gig", id],
        queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
    });

    // Set the initial state when data is loaded
    useEffect(() => {
        if (data) {
            dispatch({ type: "INIT_GIG", payload: data });
        }
    }, [data]);

    const handleChange = (e) => {
        dispatch({
            type: "CHANGE_INPUT",
            payload: { name: e.target.name, value: e.target.value },
        });

        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const featureRef = useRef();

    const handleFeature = () => {
        const feature = featureRef.current.value;
        if (!feature.trim()) {
            setErrors({ ...errors, feature: "Feature cannot be empty" });
            return;
        }

        dispatch({
            type: "ADD_FEATURE",
            payload: feature,
        });

        featureRef.current.value = "";
        setErrors({ ...errors, feature: null });
    };

    const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            setUploadProgress(progress);
            if (progress >= 95) {
                clearInterval(interval);
            }
        }, 200);
        return interval;
    };

    const handleUpload = async () => {
        setUploading(true);
        setUploadProgress(0);

        try {
            const progressInterval = simulateProgress();

            let cover = state.cover;
            if (singleFile) {
                cover = await upload(singleFile);
            }

            let images = state.images;
            if (files.length > 0) {
                const uploadedImages = await Promise.all(
                    [...files].map(async (file) => {
                        const url = await upload(file);
                        return url;
                    })
                );
                images = uploadedImages;
            }

            clearInterval(progressInterval);
            setUploadProgress(100);

            dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
            setUploading(false);
        } catch (err) {
            setErrors({ ...errors, upload: "Failed to upload images. Please try again." });
            setUploading(false);
            console.log(err);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!state.title) newErrors.title = "Title is required";
        if (!state.cat) newErrors.cat = "Category is required";
        if (!state.desc) newErrors.desc = "Description is required";
        if (!state.shortTitle) newErrors.shortTitle = "Service title is required";
        if (!state.shortDesc) newErrors.shortDesc = "Short description is required";
        if (!state.deliveryTime) newErrors.deliveryTime = "Delivery time is required";
        if (!state.revisionNumber) newErrors.revisionNumber = "Revision number is required";
        if (!state.price) newErrors.price = "Price is required";
        if (!state.cover) newErrors.cover = "Cover image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const mutation = useMutation({
        mutationFn: (updatedGig) => {
            return newRequest.put(`/gigs/${id}`, updatedGig);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["myGigs"]);
            navigate("/mygigs");
        },
        onError: (error) => {
            setErrors({ ...errors, submit: "Failed to update gig. Please try again." });
            console.log(error);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        mutation.mutate(state);
    };

    if (isLoading) return <Loader message="Loading gig data..." />;
    if (error) return <div className="error-container">Error loading gig. Please try again.</div>;

    return (
        <div className="edit-gig-page">
            <div className="container">
                <div className="add-header">
                    <h1>Edit Your Gig</h1>
                    <p>Update your service offering details</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="sections">
                        <div className="info">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. I will do something I'm really good at"
                                value={state.title}
                                onChange={handleChange}
                                className={errors.title ? "error" : ""}
                            />
                            {errors.title && <span className="error-message">{errors.title}</span>}

                            <label htmlFor="cat">Category</label>
                            <select
                                name="cat"
                                id="cat"
                                value={state.cat}
                                onChange={handleChange}
                                className={errors.cat ? "error" : ""}
                            >
                                <option value="">Select a category</option>
                                <option value="design">Graphics & Design</option>
                                <option value="web">Web Development</option>
                                <option value="animation">Animation</option>
                                <option value="music">Music & Audio</option>
                                <option value="writing">Writing & Translation</option>
                                <option value="video">Video & Animation</option>
                                <option value="business">Business</option>
                                <option value="lifestyle">Lifestyle</option>
                            </select>
                            {errors.cat && <span className="error-message">{errors.cat}</span>}

                            <div className="images">
                                <div className="imagesInputs">
                                    <label htmlFor="">Cover Image</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setSingleFile(e.target.files[0])}
                                    />
                                    {state.cover && (
                                        <div className="current-image">
                                            <span>Current cover:</span>
                                            <img src={state.cover} alt="Current cover" height="100" />
                                        </div>
                                    )}
                                    <label htmlFor="">Upload Images</label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => setFiles(e.target.files)}
                                    />
                                    {state.images && state.images.length > 0 && (
                                        <div className="current-images">
                                            <span>Current images:</span>
                                            <div className="images-preview">
                                                {state.images.map((img, index) => (
                                                    <img key={index} src={img} alt={`Image ${index}`} height="100" />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {uploading && (
                                    <div className="upload-progress">
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                )}

                                {errors.upload && <span className="error-message">{errors.upload}</span>}
                                {errors.cover && <span className="error-message">{errors.cover}</span>}

                                <button type="button" onClick={handleUpload} className="upload-button">
                                    {uploading ? "Uploading..." : "Upload"}
                                </button>
                            </div>

                            <label htmlFor="desc">Description</label>
                            <textarea
                                name="desc"
                                id=""
                                placeholder="Brief descriptions to introduce your service to customers"
                                cols="0"
                                rows="16"
                                value={state.desc}
                                onChange={handleChange}
                                className={errors.desc ? "error" : ""}
                            ></textarea>
                            {errors.desc && <span className="error-message">{errors.desc}</span>}
                        </div>

                        <div className="details">
                            <label htmlFor="shortTitle">Service Title</label>
                            <input
                                type="text"
                                name="shortTitle"
                                placeholder="e.g. One-page web design"
                                value={state.shortTitle}
                                onChange={handleChange}
                                className={errors.shortTitle ? "error" : ""}
                            />
                            {errors.shortTitle && <span className="error-message">{errors.shortTitle}</span>}

                            <label htmlFor="shortDesc">Short Description</label>
                            <textarea
                                name="shortDesc"
                                id=""
                                placeholder="Short description of your service"
                                cols="30"
                                rows="10"
                                value={state.shortDesc}
                                onChange={handleChange}
                                className={errors.shortDesc ? "error" : ""}
                            ></textarea>
                            {errors.shortDesc && <span className="error-message">{errors.shortDesc}</span>}

                            <label htmlFor="deliveryTime">Delivery Time (e.g. 3 days)</label>
                            <input
                                type="number"
                                name="deliveryTime"
                                value={state.deliveryTime}
                                onChange={handleChange}
                                className={errors.deliveryTime ? "error" : ""}
                            />
                            {errors.deliveryTime && <span className="error-message">{errors.deliveryTime}</span>}

                            <label htmlFor="revisionNumber">Revision Number</label>
                            <input
                                type="number"
                                name="revisionNumber"
                                value={state.revisionNumber}
                                onChange={handleChange}
                                className={errors.revisionNumber ? "error" : ""}
                            />
                            {errors.revisionNumber && <span className="error-message">{errors.revisionNumber}</span>}

                            <label htmlFor="">Add Features</label>
                
                            <div className="add">
                                <input
                                    type="text"
                                    placeholder="e.g. page design"
                                    ref={featureRef} // Add a ref to access the input value
                                />
                                <button
                                    type="button" // Change to type="button" to prevent form submission
                                    onClick={handleFeature} // Use a click handler instead
                                >
                                    add
                                </button>
                            </div>
                            {errors.feature && <span className="error-message">{errors.feature}</span>}

                            <div className="addedFeatures">
                                {state?.features?.map((f) => (
                                    <div className="item" key={f}>
                                        <button
                                            onClick={() =>
                                                dispatch({ type: "REMOVE_FEATURE", payload: f })
                                            }
                                            type="button"
                                        >
                                            {f}
                                            <span>X</span>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <label htmlFor="price">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={state.price}
                                onChange={handleChange}
                                className={errors.price ? "error" : ""}
                            />
                            {errors.price && <span className="error-message">{errors.price}</span>}
                        </div>
                    </div>

                    {errors.submit && <div className="submit-error">{errors.submit}</div>}

                    <button type="submit" className="submit-button">
                        {mutation.isLoading ? "Updating..." : "Update Gig"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditGig;
