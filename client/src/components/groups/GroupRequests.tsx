import { useContext, useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import DummyProfilePic from "../../assets/images/dummy-profile-pic.png";
import { ReqContext } from "../../context/features/request";

interface propsIFace {
  showModal: boolean;
  hideModal: () => void;
  groupId: string | null;
}

const GroupRequests: React.FC<propsIFace> = ({
  showModal,
  hideModal,
  groupId,
}) => {
  const {
    getGroupRequests,
    groupRequests,
    acceptGroupRequest,
    rejectGroupRequest,
    accGroupReqSuccess,
    rejGroupReqSuccess,
  } = useContext(ReqContext);

  const [accIndex, setAccIndex] = useState<number | null>(null);
  const [rejIndex, setRejIndex] = useState<number | null>(null);

  useEffect(() => {
    if (showModal && groupId) {
      if (accGroupReqSuccess || rejGroupReqSuccess) {
        setAccIndex(null);
        setRejIndex(null);
      }
      getGroupRequests(groupId);
    }
  }, [showModal, groupId, accGroupReqSuccess, rejGroupReqSuccess]);

  const acceptRequestHandler = (reqId: string, i: number) => {
    setAccIndex(i);
    acceptGroupRequest(reqId);
  };

  const rejectRequestHandler = (reqId: string, i: number) => {
    setRejIndex(i);
    rejectGroupRequest(reqId);
  };

  return (
    <div className="group-requests-bg" onClick={hideModal}>
      <div
        className="group-requests-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="header">
          <h4 id="count">
            Requests: <span>{groupRequests?.length}</span>
          </h4>
          <AiOutlineCloseCircle id="close-icon" onClick={hideModal} />
        </div>

        <div className="requests-wrapper">
          {groupRequests?.length === 0 && <p id="no-reqs">No Requests!</p>}
          {groupRequests?.map((req, i) => (
            <div className="request" key={req._id}>
              <div className="col-one">
                {req.from?.avatar ? (
                  <img src={req.from.avatar} alt="dummy pic" />
                ) : (
                  <img src={DummyProfilePic} alt="dummy pic" />
                )}
                <h5 id="name" title={req.from.username}>
                  {req.from.username?.length > 17
                    ? req.from.username.substring(0, 17) + "..."
                    : req.from.username}
                </h5>
              </div>
              <div className="col-two">
                <button
                  onClick={() => acceptRequestHandler(req._id, i)}
                  id="accept"
                >
                  {accIndex === i ? "...." : "Accept"}
                </button>
                <button
                  onClick={() => rejectRequestHandler(req._id, i)}
                  id="reject"
                >
                  {rejIndex === i ? "...." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupRequests;
