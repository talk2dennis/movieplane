import './css/ProfilePicture.css'


interface ProfilePictureProps {
    imageUrl: string | null;
    username: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ imageUrl, username = "Profile Picture" }) => {
    return (
        <div className="default-picture">
            {imageUrl ? (
                <img src={imageUrl} alt={`${username.split('@')[0]}'s profile`} />
            ) : (
                <span>{`${username.charAt(0).toUpperCase()}${username.charAt(1).toUpperCase()}`}</span>
            )}
        </div>
    );
}

export default ProfilePicture;