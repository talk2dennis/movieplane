import './Loading.css';

interface Props {
    title?: string;
}

const Loading: React.FC<Props> = ({title}) => {
    const header = title || "Loading";
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{`${header}...`}</p>
        </div>
    );
}
export default Loading;
