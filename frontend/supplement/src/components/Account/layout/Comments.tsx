import { AccountPage } from '../AccountPage'
import { BreadCrumb } from '../BreadCrumb'
import '../../../style/AccountPage/AccountBase.css'

export const Comments = () => {

  return (
    <div className='comments mb-3'>
      <div className="container p-1">
        <div className="row h-100">
          <BreadCrumb path={["comments"]}/>
          <div className="col-2 d-none d-lg-inline">
            <div className="account-left">
              <AccountPage />
            </div>
          </div>
          <div className="col-10 account-right">
            <div className="row mb-3">
              <div className="col-12">
                <div className="page-title">
                    <h3>My Comments</h3>
                </div>
              </div>
            </div>
            <div className="content">
              sa comments
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
