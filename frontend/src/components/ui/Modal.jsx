export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* fenêtre modale */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 md:mx-0 overflow-auto">
        {/* header */}
        <div className="flex justify-between items-center border-b px-4 py-2">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✖️
          </button>
        </div>

        {/* contenu modale */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
