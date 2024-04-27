import { AccountPage } from '../AccountPage'
import { BreadCrumb } from '../BreadCrumb'
import '../../../style/AccountPage/AccountBase.css'
import '../../../style/AccountPage/components/Favorites.css'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, updateUser } from '../../../redux/auth/authSlice'
import { ImageComponent } from '../../../utils/imageComponent'
import { ProductState } from '../../../types/productType'
import { useNavigate } from 'react-router-dom'
import { useLazyGetUserQuery, useRemoveFavoriteProductMutation } from '../../../redux/user/userApiSlice'
import { VariantType, useSnackbar } from 'notistack'
import Swal from 'sweetalert2'

export const Favorites = () => {

  const user = useSelector(selectCurrentUser);

  const { enqueueSnackbar } = useSnackbar();

  const handleClickVariant = (msg: string ,variant: VariantType) => () => {
    enqueueSnackbar(msg, { variant });
  };
  
  const handleSelectedProductPath = (product: ProductState) => {
    const path = product.name.toLowerCase().replace(" ","-");
    return path;
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [removeFavorites] = useRemoveFavoriteProductMutation();
  const [getUpdatedUser] = useLazyGetUserQuery();;

  const handleRemoveFavorites = async (product : ProductState) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to remove it from favorites?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#416D19",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        if(user){
          try{
            await removeFavorites({id: user?.id, credentials: product.id});
            const userUpdated = await getUpdatedUser(user.id).unwrap();
            dispatch(updateUser(userUpdated));
            handleClickVariant(`${product.name} removed from your favorites!`,'success')();
          }catch(err: any){
            console.log(err);
          }
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }

  return (
    <div className='favs mb-3'>
      <div className="container p-1">
        <div className="row h-100">
          <BreadCrumb path={["favorites"]}/>
          <div className="col-2 d-none d-lg-inline">
            <div className="account-left">
              <AccountPage />
            </div>
          </div>
          <div className="col-10 account-right">
            <div className="row mb-3">
              <div className="col-12">
                <div className="page-title">
                    <h3>Favorites</h3>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="row">
              {user?.favorites.length == 0 && <>
                    <h3 className='d-flex w-100 justify-content-center mt-5 pt-5'> You don't have any favorite item. </h3>
                    <i className="fa-solid fa-heart addressEmptyIcon"/>
                  </>}
              {user?.favorites.map((product, index) => (
                <div className='col-6 col-lg-3 showcaseItemWrapper' key={index}> 
                  <div className="showcaseItem">
                    <div className="showcaseItemHeader">
                      <div className="showcaseItemHeaderImg" onClick={() =>navigate(`/${handleSelectedProductPath(product)}`)}>
                        <ImageComponent
                        src={product.imageUrl} 
                        alt={product.name} 
                        blurhashImg={product.blurhashImg} 
                        />
                      </div>
                      <div className="showcaseItemHeaderTitle">
                          <button className='showcasePname' onClick={() =>navigate(`/${handleSelectedProductPath(product)}`)}>
                            <h3>{product.name}</h3>
                          </button>
                          <div className="d-flex align-items-center justify-content-between">
                            <button className='showcaseCname' onClick={() =>navigate(`/${product.categoryName}`)}>
                              {product.categoryName.substring(0,1).toUpperCase()+product.categoryName.substring(1)}
                            </button>
                            <button className="showcaseItemRemove" onClick={() => handleRemoveFavorites(product)}>
                              <i className="fa-solid fa-trash-can"/>
                            </button>
                          </div>  
                      </div>
                    </div>
                    <div className="showcaseItemBody">
                      <div className="showcaseItemBodyFooter">
                        <button onClick={() =>navigate(`/${handleSelectedProductPath(product)}`)}>
                          <span>DETAILS</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

