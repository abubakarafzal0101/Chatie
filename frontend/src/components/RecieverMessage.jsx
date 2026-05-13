const RecieverMessage = ({ message, image }) => {
  if ((!message || !message.trim()) && !image) return null;

  return (
    <div className="w-fit max-w-125">
      {image && (
        <img
          src={image}
          alt="received"
          className="w-40 h-40 rounded-md mb-2 object-cover"
        />
      )}

      {message?.trim() && (
        <div className="bg-gray-600 text-white px-3 py-2 rounded-lg">
          {message}
        </div>
      )}
    </div>
  );
};

export default RecieverMessage;
